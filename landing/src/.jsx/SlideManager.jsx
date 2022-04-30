const SlideManager = {};

SlideManager._elmt = {};
SlideManager._const = {
    _HEADER_ONTOP: "top",
    _HEADER_ONSCROLL: "scroll",
};

SlideManager.Header = {};
SlideManager.Header.SwitchState = (state = null) => {
    const header = SlideManager._elmt.header;

    if (state == "top") state = true;
    else if (state == "scroll") state = false;
    else
        return Engine.DOM.ClassSwitch(
            header,
            SlideManager._elmt._HEADER_ONTOP,
            SlideManager._elmt._HEADER_ONSCROLL
        );

    Engine.DOM.ClassSwitch(
        header,
        SlideManager._const._HEADER_ONTOP,
        SlideManager._const._HEADER_ONSCROLL,
        state
    );
};

SlideManager.OnScroll = () => {
    const currentScroll = window.scrollY;
    const totalScroll = window.scrollHeight;

    if (currentScroll == 0) SlideManager.Header.SwitchState('top');
    else SlideManager.Header.SwitchState('scroll');
};

SlideManager.Init = () => {
    // header for showing the appropriate style on screen scroll
    SlideManager._elmt.header = Engine.Q("header");
    SlideManager.Header.SwitchState('top');

    // getting the list of slide
    let list = Array.from(Engine.QAll(".container"));
    SlideManager._elmt.containerList = list.filter(container => container.dataset.view != undefined);
    

};
