class Slide {
    constructor(nodeElmt) {
        this._const = {
            _SLIDE_SHOW: "slide-show",
            _SLIDE_HIDE: "slide-hide"
        };
        this._elmt = nodeElmt;
        this.isHided = false;
    }

    GetSlideId(){
        return this._elmt.dataset.view;
    }

    Show() {
        this.isHided = false;
        Engine.DOM.ClassSwitch(
            this._elmt,
            this._const._SLIDE_SHOW,
            this._const._SLIDE_HIDE,
            true
        );
    }

    Hide() {
        this.isHided = true;
        Engine.DOM.ClassSwitch(
            this._elmt,
            this._const._SLIDE_SHOW,
            this._const._SLIDE_HIDE,
            false
        );
    }

    ChangeToAbsolute(toAbsolute = true){
        if(toAbsolute)
            return this._elmt.classList.add('absolute');
        
        return this._elmt.classList.remove('absolute');
    }

    SearchChild(selector){
        return this._elmt.querySelectorAll(selector);
    }

    GetTextBox(){
        return this.SearchChild('.text-box');
    }

}
