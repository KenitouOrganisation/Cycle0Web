const totalCarac = 300;
const totalObjectCarac = 80;
const totalMailCarac = 320;
const requestDate = new Date();

const ContactForms = {};
const CF = ContactForms;

// should be readonly, never use it as a thrustable value
CF.currentCarac = 0;
CF.reqUrl = "./contacts";
CF.formSubmitAtLeastOnce = false;   // allow us to show if the inputs set is wrong after only the user press once the from submit button
CF.Init = () => {

    CF._elmt = Engine.Q("#contact_forms");

    /*// TODO : remove this
    CF.TemporaryForms();
    return;*/

    CF.InitElmt();
    CF.InitAplpyArgs();
    CF.Debounce = new Engine.DebounceCall(1000);

    CF._elmt = Engine.Q("#contact_forms");
    CF._elmt.addEventListener("submit", CF.OnSubmit);

    // TODO : should not be used anymore, but we still allow it for now
    if(/colab_pro/.test(document.location.search))
        CF.selectObject.value = "collab"

    CF.FormsShow();
};
CF.InitAplpyArgs = () => {

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const subject = params.get('subject');

    // CF.selectObjectInitValue = subject ? subject : "none";
    CF.selectObject.value = subject ? subject : "none";

};
/*
CF.TemporaryForms = () => {

    CF._elmt.replaceChildren((
        <div class="not-form" style="text-align: justify; min-height: 60vh;">
            <div>
                <h2 class="h2">Nous contacter</h2>
                <p style="margin-top: 50px;">
                    Pour nous contacter, vous pouvez nous envoyer un mail à l'adresse suivante : <a href="mailto:contact@cyclezero.fr">contact@cyclezero.fr</a>.
                </p>
                <p>
                    Vous pouvez également nous retrouver sur les réseaux sociaux pour être tenu au courant de nos dernières actualités sur <a target="_blank" href="https://www.instagram.com/cyclezero.app/">Instagram</a>, <a target="_blank" href="https://www.linkedin.com/company/cycle-zero/">LinkedIn</a> et <a target="_blank" href="https://www.linkedin.com/company/cycle-zero/">Facebook</a>.
                </p>
                <br />
                <p>
                    Toute l'équipe vous remercie de votre intérêt pour Cycle Zéro 😌.
                </p>
                <br />
                <p style="
                    border-top: 1px solid #dfdfdf;
                    padding-top: 30px;
                ">
                    Vous pouvez dès à présent télécharger notre application sur vos stores préférés ! 🎉
                </p>
            </div>
        </div>
    ))

};*/

CF.InitElmt = () => {
    CF.submitBtt = <input type="submit" class="_btt _orange center-form" value="Envoyer" />;
    CF.inputEmail = (
        <input
            class="entryInput"
            type="email"
            name="email"
            placeholder=""
            required
            maxLength={totalMailCarac.toString()}
        />
    );
    CF.selectObjectValues = [
        { value: "none", title: "Sélectionner un sujet ..." },
        { value: "general", title: "Questions générales" },
        { value: "info_product_services", title: "Informations sur les produits/services" },
        { value: "support_tech", title: "Support technique" },
        { value: "bug_error", title: "Signalement de bugs ou d'erreurs" },
        { value: "suggestion", title: "Suggestions d'amélioration" },
        { value: "collab", title: "Collaborer avec Cycle Zéro" },
        { value: "press", title: "Demandes de presse ou médias" },
        { value: "other", title: "Autres" },
    ];
    CF.selectObject = (
        <select
            name="subject"
            class="entryInput"
            required
        >
            {CF.selectObjectValues.map((opt, idx) => <option value={opt.value}>{opt.title}</option>)}
        </select>
    );

    CF.inputObject = (
        <input
            class="entryInput"
            type="text"
            name="object"
            placeholder=""
            autocomplete="off"
            maxLength={totalObjectCarac.toString()}
        />
    );
    CF.textarea = (
        <textarea
            class="entryInput"
            name="message"
            id=""
            cols="30"
            rows="5"
            placeholder=""
            required
            autocomplete="off"
            maxLength={totalCarac.toString()}
        ></textarea>
    );

    CF.textareaCounterBox = (
        <p class="not-form textarea-counter center-form">
            <span class="carac">{CF.currentCarac.toString()}</span>/
            <span class="totalCarac">{totalCarac.toString()}</span>
        </p>
    );

    CF.textareaCounter = Engine.Q(".carac", CF.textareaCounterBox);

    CF.textarea.addEventListener("keyup", () => {
        const len = CF.textarea.value.length;

        if (len > totalCarac)
            return (CF.textarea.value = CF.textarea.value.slice(0, totalCarac));

        CF.currentCarac = len;
        CF.textareaCounter.innerText = len.toString();

        const redDegress = `rgb(${(255 * CF.currentCarac) / totalCarac}, 0, 0)`;
        CF.textareaCounterBox.style.color = redDegress;

    });

    CF.textarea.addEventListener("keyup", () => {
        CF.formSubmitAtLeastOnce === true && CF.CheckForm.Message();
    });

    CF.inputEmail.addEventListener("keyup", () => {
        CF.formSubmitAtLeastOnce === true && CF.CheckForm.Email();
    });

    CF.inputObject.addEventListener("keyup", () => {
        CF.formSubmitAtLeastOnce === true && CF.CheckForm.Object();
    });

    CF.selectObject.addEventListener("change", () => {
        CF.formSubmitAtLeastOnce === true && CF.CheckForm.Subject();
    });
};

CF.FormsInputsLabelRender = (ipt, label, parentProps={})=>{
    return (
        <div class="ipt-ctn center-form" {...parentProps}>
            {ipt}
            <label for={ipt.name} class="form-label">{label}</label>
            {/*<span class="form-alert"></span>
            <span class="form-check">
               <i class="ion-success ion-md-checkmark-circle"></i>
               <i class="ion-invalid ion-md-information-circle"></i>
            </span>*/}
        </div>
    )
}

CF.FormsRender = () => (
    <div class="not-form-elmt">
        <h2 class="h2 center-form">Formulaire de contact</h2>
        <p class="center-form">
            Pour faciliter votre expérience, n'oubliez pas de consulter <a href="./faq.html">notre FAQ</a>.
            <br />
            Elle regorge d'informations utiles qui pourraient répondre à vos interrogations.
            <br /><br />
            Nous vous invitons à y jeter un coup d'œil avant de nous contacter.
            Nous serons ravis de vous aider si vous ne trouvez pas la réponse que vous recherchez.
            <br />
            <br />
            Merci pour votre compréhension !
        </p>
        <br />
        
        {CF.FormsInputsLabelRender(CF.inputEmail, "Votre adresse email")}
        {CF.FormsInputsLabelRender(CF.selectObject, "Sujet")}
        {CF.FormsInputsLabelRender(CF.inputObject, "Précisez le sujet")}
        {CF.FormsInputsLabelRender(CF.textarea, "Votre message", { style : "margin-bottom: 0;" })}
        {CF.textareaCounterBox}
        <div class="h-captcha center-form" data-sitekey="2626626e-f325-458f-bc72-2d6457624cc4"></div>
        <div id="captcha-error-text"></div>
        <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
        {CF.submitBtt}
    </div>
);

CF.FormsShow = () => {
    CF._elmt?.replaceChildren(CF.FormsRender());
};

CF.CheckForm = {
    ParseCodeData : (data) => {
        // parse HTML tags
        data.message = data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        data.object = data.object.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        data.subject = data.subject.replace(/</g, "&lt;").replace(/>/g, "&gt;");    // not necessary, but for security
        data.email = data.email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return data;
    },
    Email : (data=null) => {

        let correct = true;

        data = data
            ? data
            : {email : CF.inputEmail.value};

        // check email
        const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
        if (!emailRegex.test(data.email)) {
            CF.inputEmail.setCustomValidity("Veuillez utiliser une adresse mail valide");
            CF.inputEmail.reportValidity();
            correct = false;
        }else{
            correct = ContactCheckMail(CF.inputEmail);
        }

        // check email length
        if (data.email.length > totalMailCarac) {
            CF.inputEmail.setCustomValidity(
                `L'adresse mail ne doit pas dépasser ${totalMailCarac} caractères`
            );
            CF.inputEmail.reportValidity();
            correct = false;
        }

        // check email max length
        if (data.email.length > totalMailCarac) {
            CF.inputEmail.setCustomValidity(
                `L'adresse mail ne doit pas dépasser ${totalMailCarac} caractères`
            );
            CF.inputEmail.reportValidity();
            correct = false;
        }

        // check email minimum length of 10
        if (data.email.length < 10) {
            CF.inputEmail.setCustomValidity(
                `L'adresse mail doit contenir au moins 10 caractères`
            );
            CF.inputEmail.reportValidity();
            correct = false;
        }

        if(correct)
            CF.inputEmail.setCustomValidity("");

        return correct;
    },
    Object : (data=null) => {

        let correct = true;

        data = data
            ? data
            : {object : CF.inputObject.value};

        // check object
        if (data.object.length > totalObjectCarac) {
            CF.inputObject.setCustomValidity(
                `L'objet ne doit pas dépasser ${totalObjectCarac} caractères`
            );
            CF.inputObject.reportValidity();
            correct = false;
        }
        
        // check object minimum length of 10
        // if (data.object.length < 10) {
        //     CF.inputObject.setCustomValidity(
        //         `L'objet doit contenir au moins 10 caractères`
        //     );
        //     CF.inputObject.reportValidity();
        //     correct = false;
        // }

        if(correct)
            CF.inputObject.setCustomValidity("");

        return correct;
    },
    Subject : (data=null) => {

        // we check if subject is not equal to "none", and if it's not, we check if it's not empty
        data = data
            ? data
            : {subject : CF.selectObject.value};

        let correct = true;
        

        if(data.subject === "none" || data.subject === "")
            correct = false;

        // check if suject exist on the list, to rpevent user to change the value manually on the inspector and send a wrong value
        if( CF.selectObjectValues.filter(opt => opt.value === data.subject).length < 1 ){
            // console.warn("The subject value is not on the list, it's probably a user manipulation")
            correct = false;
        }

        if(!correct){
            CF.selectObject.setCustomValidity("Veuillez choisir un sujet");
            CF.selectObject.reportValidity();
        }else{
            CF.selectObject.setCustomValidity("");
        }

        return correct;

    },
    Message : (data=null) => {

        let correct = true;

        data = data
            ? data
            : {message : CF.textarea.value};

        // check message
        if (data.message.length > totalCarac) {
            CF.textarea.setCustomValidity(
                `Le message ne doit pas dépasser ${totalCarac} caractères`
            );
            CF.textarea.reportValidity();
            correct = false;
        }

        // check message minimum length of 10
        if (data.message.length < 10) {
            CF.textarea.setCustomValidity(
                `Le message doit contenir au moins 10 caractères`
            );
            CF.textarea.reportValidity();
            correct = false;
        }

        if(correct)
            CF.textarea.setCustomValidity("");

        return correct;
    },

    Captcha : () => {

        const captchaErrorText = Engine.Q('#captcha-error-text');
        captchaErrorText.innerHTML = "";

        try{
            const token = grecaptcha.getResponse();
            if(token){
                console.log("CAPTCHA verification passed");
                
                // remove captchaErrorText children if exist and replace it by a new p text
                while (captchaErrorText.firstChild) {
                    captchaErrorText.removeChild(captchaErrorText.firstChild);
                }

                return true;
            }

            console.log("CAPTCHA verification failed");
            
            captchaErrorText.appendChild(<p class="center-form" style="color: red; font-size: 17px; margin-top: 0;" >Veuillez valider le captcha</p>);
            return false;
        }
        catch(err){
            console.error(err);
            captchaErrorText.appendChild(<p style="color: 'red;" >Une erreur s'est produite lors de la validation du captcha.</p>);
        }
        
        return false;
    },

    All : (data) => {
        const checkEmail = CF.CheckForm.Email(data);
        const checkObject = CF.CheckForm.Object(data);
        const checkSubject = CF.CheckForm.Subject(data);
        const checkMessage = CF.CheckForm.Message(data);
        const checkCaptcha = CF.CheckForm.Captcha();

        return checkEmail && checkObject && checkSubject && checkMessage && checkCaptcha;
    }

};


CF.OnSubmit = (e) =>
    CF.Debounce.InvokeAsync(async () => {
        e.preventDefault();
        await CF.OnSubmitDebounceCall(e);
    });

CF.OnSubmitDebounceCall = async (e) => {
    CF.submitBtt.disabled = true;
    CF.formSubmitAtLeastOnce = true;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const form = e.target;
    const data = new FormData(form);

    const dataObj = CF.CheckForm.ParseCodeData(Object.fromEntries(data));
    const checkForm = CF.CheckForm.All(dataObj);

    if (!dataObj || !checkForm) {
        CF.submitBtt.disabled = false;
        return;
    }

    const subjectOption = CF.selectObjectValues.find(opt => opt.value === dataObj['subject']);
    const subjectTitle = subjectOption ? subjectOption.title : dataObj['subject'];
    dataObj['message'] +=  `


--------------------
Email : ${dataObj['email']}
Sujet ID : ${dataObj['subject']}
Sujet : [${subjectTitle}] ${dataObj['object']}
Date d'envoi : ${new Date().toLocaleString()}
Requête : ${window.location.href}
Date de la requête : ${requestDate.toLocaleString()}
-------------------

`;  

    
    // addinng html line break to the message
    dataObj['message'] = dataObj['message'].replace(/\n/g, "<br />");
    dataObj['object'] = `[${dataObj['subject']}] ${dataObj['object']}`;
    delete dataObj['subject'];
    console.log(dataObj)

    // send data to server
    const resp = await Engine.Ajax.FetchJSON(CF.reqUrl, {
        method: "POST",
        body: JSON.stringify(dataObj),
        headers: headers,
    });

    //Engine.Console.Log(resp);

    if (!resp.req || resp.req?.status == 404) {
        CF.submitBtt.disabled = false;

        return Engine.Alert.Error({
            title: "Erreur serveur",
            message:
                "Le serveur est inaccessible pour le moment, veuillez réessayer dans quelques instants ...",
        });
    }

    if (resp.req?.status == 200) {
        // replace form with success message
        CF._elmt.replaceChildren(
            <div class="center-form">
                <h2 class="h2">Formulaire de contact</h2>
                <p class="not-form">
                    Votre message a bien été envoyé, nous allons le traiter dans les plus brefs délais.
                    <br />
                    Toute l'équipe vous remercie de votre intérêt pour Cycle Zéro 😌.
                    <br />
                    <br />
                    A très bientôt !
                </p>
                <div class="not-form special-end-btn">
                    <a href="/" class="_btt _orange">
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        );

        return;
    }

    Engine.Alert.Error({
        title: `Erreur ${resp.req?.status}`,
        message: `Une erreur ${resp.req?.status} est survenue.`
    });

    CF.submitBtt.disabled = false;

};
