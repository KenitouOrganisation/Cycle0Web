// function to be Init on page ready
const Init = {};

Init.JSOnFlag = () => {
    document.body.classList.add("js-on");
};

Init.CenterBodyBkground = () => {
    const bkgroundElmt = Engine.Q("#body-background");
    const bodyRect = Engine.DOM.getRect(document.body);
    const centerPos = bodyRect.height / 2;

    bkgroundElmt.style.top = centerPos + "px";
};

Init.AnchorLinkScrollManaged = () => {
    const targetIdAnchor = "pre-inscription";
    const targetElmt = Engine.Q("#" + targetIdAnchor);
    let buttonList = Engine.QAll(`a[href="#${targetIdAnchor}"]`);

    buttonList = Array.from(buttonList);
    buttonList.forEach((btt) => {
        btt.addEventListener("click", (e) => {
            e.preventDefault();
            targetElmt.scrollIntoView({
                block: "start",
                inline: "nearest",
                behavior: "smooth",
            });
            SlideManager.ignoringLastSlideScroll = true;
        });
    });
};

Init.IgnoringLastSlideScroll = ()=> {
    // if presence of hash, we ignore the last slide blocking

    if(document.location.hash != "")
        SlideManager.ignoringLastSlideScroll = true;
};

const InitManual = {};

InitManual.AssignAnimationWhenVisible = ()=>{
    const animBox = Array.from(Engine.QAll('.anim-box'));
    const className = {
        _ON_VISIBLE : 'show',
        _ON_HIDE : 'hide'
    };

    animBox.forEach(box => {
        if(Engine.DOM.IsVisible(box) === true)
            Engine.DOM.ClassSwitch(box, className._ON_VISIBLE, className._ON_HIDE, true);
        else
            Engine.DOM.ClassSwitch(box, className._ON_VISIBLE, className._ON_HIDE, false);
        
    });
};