const PreInscription = {}
const PI = PreInscription;

PI.prefix = './pre-registration'
PI._elmt = {};
PI.previousCount = 0;

PI.Init = ()=>{
    PI._elmt.box = Engine.Q('#form_box');
    PI._elmt.form = Engine.Q('#form_preinscription');
    PI._elmt.formContainer = Engine.Q('#form_container');
    PI._elmt.counters = Array.from( Engine.QAll('span[data-elmt="preinscription"]') );
    PI._elmt.iptMail = Engine.Q('#pre-form-email');
    PI._elmt.iptPostal = Engine.Q('#pre-form-postal');
    PI._elmt.submit = Engine.Q("#pre-inscription input[type='submit']");

    PI._elmt.iptMail.addEventListener('blur', PI.CounterkMobileAutoscrollKeyboard);
    PI._elmt.iptPostal.addEventListener('blur', PI.CounterkMobileAutoscrollKeyboard);

    PI._elmt.submit.addEventListener('click', (e)=>{
        e.preventDefault();
        PI.Submit();
    });

    // applying count every 2 minutes
    PI.Count();
    setInterval(()=>{
        PI.Count();
    }, 2 * 60 * 1000);

};

PI.CounterkMobileAutoscrollKeyboard = (e)=>{
    // counter the auto scroll
    // FIXME : blocking the SliderManager scroll event seems to not working (due to smooth autoscroll of mobile keyboard disappear)
    // this fix is subject to blinking on the page unfortunately
    const ResetScroll = ()=> document.scrollingElement.scrollTo(0, SlideManager.totalHeightScroll);
    
    setTimeout(()=>{
        ResetScroll();
        
        // we double the call in case the mobile version smooth autoscroll is slower
        setTimeout(()=>{
            ResetScroll();
        }, 500);
    }, 50);

};

PI.Count = async ()=>{
    // we fetch the counter of pre-inscription
    let result = await Engine.Ajax.FetchText(PI.prefix + '/count', { method : 'GET' });

    result = result.text;
    result = !result || isNaN(result) ? PI.previousCount : parseInt(result);  // checking if result is a number
    PI.previousCount = result;
    result = PI.FormatCount(result);

    // applying the number to all counters in the page
    PI._elmt.counters.forEach(counter =>{
        if(counter)
            counter.innerHTML = result;
    });
    
};

PI.FormatCount = (val)=>{
    // format number like : 23421 => 23 421 https://stackoverflow.com/a/30106316/9408443
    return val.toLocaleString({minimumFractionDigits : 0});
};

PI.Submit = async ()=>{
    const data = {
        email : PI._elmt.iptMail ? PI._elmt.iptMail.value : '',
        postalCode : PI._elmt.iptPostal ? PI._elmt.iptPostal.value : ''
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const repFetch = await Engine.Ajax.FetchJSON(
        PI.prefix,
        {
            method : 'POST',
            body : JSON.stringify(data),
            headers : headers
        }
    );
    const req = repFetch.req;

    if(repFetch.err){
        Engine.Alert(req.err.toString());
        Engine.Console.Error(req.err.toString());
        return;
    }

    if(req.status == 200){
        const popup = (
            <div id="popup">
                <button
                    style="visibility:hidden"
                    class="close"
                    data-js-attr={{
                        onclick : ()=>{
                            popup.parentNode.removeChild(popup);
                        }
                    }}
                >X</button>
                <iframe
                    src="./src/page/remerciement_validation.html"
                    style="
                        width: 100%;
                        height: 100%;
                        border: none;
                    "
                ></iframe>
            </div>
        );
        const ctn = (
            <div>
                {popup}
            </div>
        );
        /*document.body.appendChild(ctn);
        
        PI._elmt.iptMail.value = '';
        PI._elmt.iptPostal.value = '';


        // we removed the form for preventing multiple submition
        Engine.DOM.removeElmt(PI._elmt.form);
        PI._elmt.formContainer.style.justifyContent = 'center';*/

        // we update the counter, we replace the form by the new thanks page 
        // and we show the number of presubscribe button on top for mobile version to see the number
        PI.Count();
        PI._elmt.box.innerHTML = ctn.innerHTML;
        Engine.DOM.ClassSwitch(document.body, 'alrd_sub', 'not_sub', true);

        return;
    }

    alert(repFetch.json.message);

};

PI.ThanksPage = async ()=>{
    return 'html';
};