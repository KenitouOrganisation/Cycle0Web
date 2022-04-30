const SlideManager = {};
const SM = SlideManager;

SM._elmt = {};
SM._const = {
    _HEADER_ONTOP: "top",
    _HEADER_ONSCROLL: "scroll",
};
SM.slideList = [];
SM.currentSlide = 0;
SM.Header = {};

SM.Init = ({ slideHeightCssVar }) => {
    // getting the cs variable controlling the height of each slide
    SM._const._SLIDE_HEIGHT_CSS_VAR = slideHeightCssVar;

    // header for showing the appropriate style on screen scroll
    SM._elmt.header = Engine.Q("header");
    SM.Header.SwitchState("top");

    // getting the list of slide
    let list = Array.from(Engine.QAll(".container"));
    list = list.filter((container) => container.dataset.view != undefined);
    list.map((container) => {
        const newSlide = new Slide(container);
        SM.slideList.push(newSlide);
    });

    // creating the fakespace node
    SM._elmt.viewContainer = Engine.Q("#view");
    SM._elmt.fakeSpace = (
        <div id="fake-space" class="container">
            <div class="vertical center-box"></div>
        </div>
    );

    // Showing the first slide (or the selected side in the url)
    SM.ShowSlide(SM.currentSlide);
};

SM.Header.SwitchState = (state = null) => {
    const header = SM._elmt.header;
    Engine.DOM.ClassSwitch(
        header,
        SM._const._HEADER_ONTOP,
        SM._const._HEADER_ONSCROLL,
        false
    );
    return;

    // FIXME : problem, to be fixed
    if (state != null) {
        // true or false

        if (state == SM._elmt._HEADER_ONTOP) state = true;
        else if (state == SM._elmt._HEADER_ONSCROLL) state = false;
        else state = null;
    }

    Engine.DOM.ClassSwitch(
        header,
        SM._const._HEADER_ONTOP,
        SM._const._HEADER_ONSCROLL,
        state
    );
};

SM.OnScroll = (e) => {
    const scrollingElmt = e.target.scrollingElement;
    const currentScroll = scrollingElmt.scrollTop;
    const totalScroll = scrollingElmt.scrollHeight;
    const slideHeight = SM.GetSlideHeight();
    const slidePosition = Math.round(currentScroll / parseInt(slideHeight));

    // header managing
    if (currentScroll == 0) SM.Header.SwitchState("top");
    else SM.Header.SwitchState("scroll");

    // slide selecting
    const currentSlide = Engine.MATH.Bounded({
        min: 0,
        max: SM.slideList.length,
        value: slidePosition,
    });

    if (currentSlide != SM.currentSlide) SM.ShowSlide(currentSlide);
    SM.currentSlide = currentSlide;
};

SM.OnResize = () => {};

// to avoid error when using the array like : [0].elmt
SM.SlideIndex = (index) => {
    const slide = SM.slideList[index];
    return slide ? slide : {};
};

SM.ShowSlide = (slideNumber) => {
    // if (slideNumber == 0)
    //     // inserting at the start of the first container !
    //     SM._elmt.viewContainer.insertBefore(
    //         SM._elmt.fakeSpace,
    //         SM.SlideIndex(0)._elmt
    //     );

    SM.slideList.map((slide) => {
        if (slideNumber == slide.GetSlideId()) {
            slide.Show();
            //slide._elmt.parentNode.appendChild(SM._elmt.fakeSpace);
            Engine.DOM.insertAfter(SM._elmt.fakeSpace, slide._elmt);
        } else slide.Hide();
    });

    SM.SetFakeSpace();
};

SM.SetSlideHeight = (value) => {
    Engine.CSS.SetVar(SM._const._SLIDE_HEIGHT_CSS_VAR, value);
};

SM.GetSlideHeight = () => {
    return Engine.CSS.GetVar(SM._const._SLIDE_HEIGHT_CSS_VAR);
};

// Allowing to recreate the space in height of the slide we hide, to create a dynamic slide show with scroll
SM.SetFakeSpace = () => {
    const hidedSlideNb = SM.slideList.length;
    const totalHeight = Engine.MATH.WithUnit.Multiply(
        hidedSlideNb,
        SM.GetSlideHeight()
    );

    SM._elmt.fakeSpace.style.height = totalHeight;
};
