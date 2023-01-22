class GalleryBox {
    /**
     * Animate the GalleryBox when first scroll into view
     * @param {Element} elmt .gallery-container
     */
    constructor(elmts) {
        this.elmts = elmts;
        this.isShown = false;

        // when on computer, we show all the gallery when scrolling into view
        if (!Engine.isMobileScreen())
            new Engine.Observer.Intersection(elmts, (obj) =>
                this.HandleIntersect(obj)
            );
        else {
            console.log("?")
            // else we show up a manual scroll system view (one by one)
            for (const elmt of elmts) {
                new GalleryBox_Switcher(elmt);
            }
        }
    }

    async AnimGallery(target) {
        const boxes = Engine.QAll(".gallery-box", target);

        for (const box of boxes) {
            box.classList.add("show");
            await Engine.WaitFor(300);
        }

        this.isShown = true;
    }

    HandleIntersect({ isPrevious, target, entry }) {
        /*if(Math.floor(entry.intersectionRatio*10)/10 == 0.5 && isPrevious && !isShown)
            return AnimGallery(target);*/

        if (!this.isShown && entry.intersectionRatio != 0)
            return this.AnimGallery(target);
    }
}

class GalleryBox_Switcher {
    constructor(elmt) {
        this.elmt = elmt;
        this.childs = Engine.QAll(".gallery-box", elmt);

        this.boxHeight = 0;
        this.currentSlide = 0;
        this.totalSlide = this.childs.length;
        this.switcherBtt = [];

        this.buttonsCtn = <div class="switcher"></div>;

        for (let i = 0; i < this.totalSlide; i++) {

            const btt = (<div class="switcher-btt"></div>);
            btt.addEventListener('click', ()=>this.ShowSlide(i));
            this.switcherBtt.push(btt);
            // adding the switch button
            this.buttonsCtn.appendChild(btt);

            // adding click event switch slide on next-img button
            const nextImg = Engine.Q('.next-img', this.childs[i]);

            if(nextImg)
                nextImg.addEventListener('click', ()=>this.ShowSlide(i+1));
        
            // we determine the larger height, so when we swipe the container will always have the same size
            this.childs[i].classList.add('show');
            const height = Engine.DOM.getRect(this.childs[i]).height;
            //console.log(height)
            if(height > this.boxHeight)
                this.boxHeight = height;

            this.childs[i].classList.remove('show');

        }

        this.elmt.style.height = this.boxHeight + 'px';

        // adding swipe event to box
        new Engine.SwipeHandle(elmt, (direction)=>this.OnSwipe(direction));

        this.elmt.style.overflow = "hidden"; // no scroll when Javascript is enable
        Engine.DOM.insertAfter(this.buttonsCtn, this.elmt);

        this.ShowSlide(0);

    }

    OnSwipe(direction){
        if(direction)
            this.ShowSlide(this.currentSlide - direction);
    }

    ShowSlide(slideNumber) {
        if (slideNumber >= this.totalSlide) slideNumber = this.totalSlide - 1;

        if (slideNumber < 0) slideNumber = 0;

        for (const i in Array.from(this.childs)) {
            if (i == slideNumber) {
                this.childs[i].classList.add("show");
                this.switcherBtt[i].classList.add("on");
            } else {
                this.childs[i].classList.remove("show");
                this.switcherBtt[i].classList.remove("on");
            }
        }

        this.currentSlide = slideNumber;

    }
}
