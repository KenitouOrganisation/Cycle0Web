Engine.SwipeHandle = class{
  
    /**
     * Only work for mobile (no computer support for now)
     * 
     * https://stackoverflow.com/a/56663695/9408443
     * 
     * @param {Element} elmt 
     */
    constructor(elmt, onSwipeCallback){
        this.elmt = elmt;
        this.onSwipeCallback = onSwipeCallback;
        this.touchstart = { x: 0, y: 0 };
        this.touchend = { x: 0, y: 0 };

        elmt.addEventListener('touchstart', (e)=>this.SwipeStart(e))
        elmt.addEventListener('touchend', (e)=>this.SwipeEnd(e))
    }

    SwipeStart(e){
        this.touchstart.x = e.changedTouches[0].screenX;
        this.touchstart.y = e.changedTouches[0].screenY;
    }

    SwipeEnd(e){
        this.touchend.x = e.changedTouches[0].screenX;
        this.touchend.y = e.changedTouches[0].screenX;

        this.onSwipeCallback(this.CheckHorizontalDirection());

    }

    /**
     * 
     * @returns {number} -1 for left and 1 for right
     */
    CheckHorizontalDirection(){
        if (this.touchend.x < this.touchstart.x) return -1; // left
        if (this.touchend.x > this.touchstart.x) return 1; // right
    }

    /**
     * @deprecated not working to be fixed
     */
    CheckVerticalDirection(){
        if (this.touchend.y < this.touchstart.y) alert('swiped down!');
        if (this.touchend.y > this.touchstart.y) alert('swiped up!');
    }

};