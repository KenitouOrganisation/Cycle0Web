const SlideManager = {};
const SM = SlideManager;

SM._elmt = {};
SM._const = {
    _HEADER_ONTOP: "top",
    _HEADER_ONSCROLL: "scroll",
};
SM.slideList = [];
SM.currentSlide = 0;
SM.lastSlideUnlocked = false;
SM.Header = {};
SM.ignoringLastSlideScroll = false;

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
    Engine.DOM.insertAfter(
        SM._elmt.fakeSpace,
        SM.SlideIndex({ last: true })._elmt
    );

    // Showing the first slide (or the selected side in the url)
    SM.ShowSlide(SM.currentSlide);
    SM.SetFakeSpace();

    // Applying priority for text animation
    SM.slideList.forEach(slider => {

        const textBox = Array.from(slider.GetTextBox());
        let priority = 1;
        textBox.forEach(box => {
            box.classList.add('priority');
            box.classList.add('_' + priority);

            if(priority == 1)
                priority = 2;
        })

    });

};

SM.Header.SwitchState = (state = null) => {
    /*
        3 cases :
        - state = null (we just want to call the switch class whenever the current class value)
        - state = top(true) (we force the top style class)
        - state = scroll(false) (we force the scroll style class)
    */

    state = state == "top" ? true : state;
    state = state == "scroll" ? false : state;

    const header = SM._elmt.header;
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
    const slideHeight = parseInt(SM.GetSlideHeight());
    const slidePosition = Math.floor(currentScroll / slideHeight);

    // slide selecting
    const currentSlide = Engine.MATH.Bounded({
        min: 0,
        max: SM.slideList.length - 1,
        value: slidePosition,
    });

    if (currentSlide != SM.currentSlide) SM.ShowSlide(currentSlide);
    SM.currentSlide = currentSlide;

    // header managing
    if (SM.currentSlide == 0) SM.Header.SwitchState("top");
    else SM.Header.SwitchState("scroll");

    // last slide unlock
    const lastSlide = SM.slideList[SM.slideList.length - 1];

    if (SM.lastSlideUnlocked != true && SM.LastSlideReach() === true) {
        SM.lastSlideUnlocked = true;

        // we move the fakeSpace before our slide to position it normally with absolute position
        Engine.DOM.insertBefore(SM._elmt.fakeSpace, lastSlide._elmt);
        // changing the fixed position to absolute of the last slide
        lastSlide.ChangeToAbsolute();
        // and we make a focus directly if flag not false
        if(SM.ignoringLastSlideScroll !== true)
            lastSlide._elmt.scrollIntoView(true);
        else
            SM.ignoringLastSlideScroll = false;
            
    } else if (SM.lastSlideUnlocked != false && SM.LastSlideReach() !== true) {
        SM.lastSlideUnlocked = false;
        lastSlide.ChangeToAbsolute(false);
    }
};

SM.OnResize = () => {
    SM.SetFakeSpace();
};

// to avoid error when using the array like : [0].elmt
SM.SlideIndex = (index) => {
    if (index.last && index.last == true) index = SM.slideList.length - 1;

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

            // Engine.DOM.insertAfter(SM._elmt.fakeSpace, slide._elmt);
        } else slide.Hide();
    });
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

SM.LastSlideReach = () => {
    return SM.currentSlide == SM.slideList.length - 1;
};
