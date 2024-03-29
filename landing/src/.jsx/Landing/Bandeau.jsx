class Bandeau{
    constructor(){
        this.elmt = Engine.Q('#bandeau-hashtags');
        this.keywords = [
            "synergie",
            "urbanisme bas carbone",
            "frugalité",
            "sobriété",
            "Économie circulaire",
            "Écologie",
            "Valorisation",
            "Sobriété Réemploi",
            "Construction",
            "BTP",
            "Antigaspi",
            "Innovation ESS",
            "Chantier",
            "Zéro déchet",
        ];
    }

    render(){

        const container = (
            <div class="anim"></div>
        )

        const imgNo = [14, 11, 12, 10, '08', '09'];
        

        this.keywords.forEach((keyword, index)=>{
            const elmt = (
                <div class="bandeau-elmt">
                    <img src={`./src/img/icons/Picto_Or_${imgNo[index%imgNo.length]}.png`} alt={keyword} />
                    <p>#{keyword}</p>
                </div>
            )
            container.appendChild(elmt);
        });

        this.elmt.appendChild(container);
        this.elmt.appendChild(container.cloneNode(true));

    }

}

/*class Bandeau
{
    constructor(elmt, childElmtName=null, step=300){

        if(!elmt)
            throw new Error('elmt provide is null')

        this.step = step;
        this.elmt = elmt;
        this.childs = Engine.QAll(childElmtName ? childElmtName : '.bandeau-elmt', this.elmt);
        this.totalWith = 0;

        // calculating the total parent width
        for(const child of this.childs){

            const rect = Engine.DOM.getRect(child);
            if(rect)
                this.totalWith += rect.width;

        }

        this.resetTrigger = 0;
        this.currentPos = 0;
        this.maxPos = this.totalWith/1.25; // since the bandeau is center, we only considered half the total size
        
    }

    Animate(){

        if(this.resetTrigger == 1){
            this.resetTrigger = 2;
        }
        else if(this.resetTrigger == 2){
            this.elmt.style.opacity = "1";
            this.elmt.style.transitionDuration = "2s";
            this.resetTrigger = 0;
        }


        // when we reach the left side
        if(this.currentPos < -this.maxPos){
            this.currentPos = this.totalWith
            this.elmt.style.opacity = "0";
            this.elmt.style.transitionDuration = "0s";
            this.resetTrigger = 1;
        }
        else{
            this.currentPos -= this.step;
        }

        this.elmt.style.transform = `translateX(${this.currentPos}px)`;
        setTimeout(()=>this.Animate(), 2000);
    }




}*/