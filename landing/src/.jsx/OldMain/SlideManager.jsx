const SlideManager = {};
const SM = SlideManager;

SM._elmt = {};
SM._const = {
    _HEADER_ONTOP: "top",
    _HEADER_ONSCROLL: "scroll",
};
SM.slideList = [];
SM.currentSlide = 0;
SM.previousScroll = 0;
SM.lastSlideUnlocked = false;
SM.Header = {};
SM.onfirstload = true;      // to counter auto scroll bug on load page
SM.ignoringLastSlideScroll = false; // this is for when if a hash is used in the url
SM.ignoringSlideChanging = false;   // this is used when an unfocus happen on input mobile version to block the lside changing
SM.totalHeightScroll = 0;
SM.Paging = {};

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
        newNode = SM._elmt.fakeSpace,
        referenceNode = SM.SlideIndex({ last: true })._elmt
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

            // le premier de la liste des text-box aura une priorité 1, les autres seront 2
            if(priority == 1)
                priority = 2;
        })

    });

    SM.Paging.Init();
    // init the scroll once, to match the slide with the start scroll
    // When reloading the page in browser, it keeps the same scroll, so the same slide should be showed
    SM.OnScroll({target : document});

    SM.totalHeightScroll = document.scrollingElement.scrollHeight;
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

    if(SM.onfirstload == true){
        document.scrollingElement.scrollTo(0, 0);
        SM.onfirstload = false;
        return;
    }

    if(SM.ignoringSlideChanging != false){
        // if an element is set to be on screen, we block the autoscroll (specially on mobile version for input unfocus event)
        e.preventDefault();
        if(SM.ignoringSlideChanging instanceof Node)
            //SM.ignoringSlideChanging.scrollIntoView();
            // FIXME this is a temporary fix, considering there's only one form only at the last slide (end of the html page)
            document.scrollingElement.scrollTo(0, SM.totalHeightScroll);
        SM.ignoringSlideChanging = false;
        return;
    }

    const scrollingElmt = e.target.scrollingElement;
    const currentScroll = scrollingElmt.scrollTop;
    const totalScroll = scrollingElmt.scrollHeight;
    const slideHeight = parseInt(SM.GetSlideHeight());
    const scrollDelta = currentScroll - SM.previousScroll;
    const slidePosition =  Math.round(currentScroll / slideHeight);

    //console.log(currentScroll)
    SM.previousScroll = currentScroll;

    // slide selecting by setting min and max limit
    const currentSlide = Engine.MATH.Bounded({
        min: 0,
        max: SM.slideList.length - 1,
        value: slidePosition,
    });

    // if we are still in the same slide as previously recorded, we don't redo the whole process for performance saving
    if (currentSlide == SM.currentSlide) return;

    SM.ShowSlide(currentSlide);
    SM.currentSlide = currentSlide;

    SM.Paging.OnScroll();

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
        //lastSlide.ChangeToAbsolute(true);
        // and we make a focus directly if flag not false
        if(SM.ignoringLastSlideScroll !== true)
            lastSlide._elmt.scrollIntoView(true);
        else
            SM.ignoringLastSlideScroll = false;
            
    } else if (SM.lastSlideUnlocked != false && SM.LastSlideReach() !== true) {
        SM.lastSlideUnlocked = false;
        //lastSlide.ChangeToAbsolute(false);
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

    // like a sorting, we show the appropriate slide into view
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
        hidedSlideNb+1,
        SM.GetSlideHeight()
    );

    SM._elmt.fakeSpace.style.height = totalHeight;
};

SM.LastSlideReach = () => {
    return SM.currentSlide == SM.slideList.length - 1;
};

SM.JumpTo = (slideIdx, smooth=true) => {
    // setting the limit in case
    slideIdx = Engine.MATH.Bounded({
        min: 0,
        max: SM.slideList.length - 1,
        value: slideIdx,
    });
    
    const slideHeight = parseInt(SM.GetSlideHeight());
    const targetScroll = Math.ceil(slideIdx * slideHeight);

    //document.scrollingElement.scrollTo(0, targetScroll);
    document.scrollingElement.scrollTo({
        top : targetScroll,
        left : 0,
        behavior: smooth ? "smooth" : "auto"
    });

};

SM.JumpForward = ()=>{
    SM.JumpTo(SM.currentSlide + 1);
};

/*
    Paging : to show paging step or scrolldown indicator under each data-view slide
*/

SM._elmt._paging = {}
SM.Paging.list = [];
SM.Paging.Init = ()=>{

    // determining the nb of paging
    let list = Array.from(Engine.QAll(".container"));
    list = list.filter((container) => container.dataset.paging != undefined);
    SM.Paging.list = list;

    // creating the dot for the pagination
    SM._elmt._paging.dots = ( <div id="dots"></div> );
    for(let i = 0; i < list.length; i++){
        const idx = i+1;
        const dot = (
            <div 
                class="dot" 
                data-index={idx}
                data-js-attr={{
                    onclick : ()=>{
                        // we recover the targeted slide by data-paging index
                        // then we get the data-view value
                        const target = SM.slideList.filter(slide => slide.GetPagingId() == idx);
                        if(target.length < 1) return;

                        SM.JumpTo(target[0].GetSlideId());
                    }
                }}
            ></div>
        );
        SM._elmt._paging.dots.appendChild( dot );
    }

    // creating the paging box
    SM._elmt._paging.text = ( <p class="p_2 text"></p> );
    SM._elmt._paging.container = (
        <div
            id="paging-box"
            class="horizontal _dark"
        >
            {SM._elmt._paging.dots}
            <div 
                class="next"
                title="Suivant"
                data-js-attr={{
                    onclick : ()=>SM.JumpForward()
                }}
            >
                {SM._elmt._paging.text}
                <img
                    src="./src/img/arrow-bottom.png"
                    alt="🡳"
                    class="arrow-bottom"
                    width="16px"
                />
            </div>
            
        </div>
    );

    document.body.appendChild(SM._elmt._paging.container);

    SM.Paging.OnScroll();   // on lance OnScroll à l'init pour afficher en fonction de la page courante au démarrage

};

SM.Paging.OnScroll = (currentSlide=SM.currentSlide)=>{
    const slide = SM.slideList[currentSlide];
    const _paging = SM._elmt._paging;

    // on vérifie si la pagination doit être affichée
    if(slide.GetDataset("pagingOn") == "false")
        return Engine.DOM.ClassSwitch(_paging.container, 'hide', 'show', true);
    
    Engine.DOM.ClassSwitch(_paging.container, 'hide', 'show', false);
    _paging.text.replaceChildren((
        <span>
            {slide.GetDataset("pagingText")}
        </span>
    ));

    // gestion des dots
    // on vérifie si les dots doivent être affichés
    const pagingIdx = slide.GetDataset("paging");

    if(!pagingIdx)
        return Engine.DOM.ClassSwitch(_paging.dots, 'hide', 'show', true);

    // si affiché
    Engine.DOM.ClassSwitch(_paging.dots, 'hide', 'show', false);

    // on va sélectionner le paging actuel
    SM._elmt._paging.dots.childNodes.forEach(dot => {
        const idx = dot.dataset.index;
        if(idx != pagingIdx)
            Engine.DOM.ClassSwitch(dot, 'off', 'on', true);
        else
            Engine.DOM.ClassSwitch(dot, 'off', 'on', false);

    });
    
};