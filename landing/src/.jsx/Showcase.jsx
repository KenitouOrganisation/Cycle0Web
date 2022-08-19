// Diaporama de photos (notamment la diapo 5)
class Showcase
{
    constructor(parentBoxName, childName, childPerView=1){
        this.parentBox = Engine.Q(parentBoxName);
        this.childs = Engine.QAll(parentBoxName + ' ' + childName);
        this.childPerView = childPerView;

        this.animInterval = null;

        // initialisation
        this.Show(0);
    }

    Show(startIdx){
        const lastIdx = startIdx + this.childPerView;
        for(let i = 0; i < this.childs.length; i++){
            const selectedChild = this.childs[i];

            if(i >= startIdx && i < lastIdx)
                Engine.DOM.ClassSwitch(selectedChild, '_', 'hide', true);
            else
                Engine.DOM.ClassSwitch(selectedChild, 'hide', '_', true);
                
        }
    }

    Animate(){
        let i = 0;
        let direction = 1;
        this.animInterval = setInterval(()=>{

            if(!Engine.DOM.IsVisible(this.parentBox))
                return;

            if(direction == 1 && i + this.childPerView >= this.childs.length)
                direction = -1;
            else if(direction == -1 && i <= 0) 
                direction = 1;

            i += direction;
            this.Show(i);

        }, 3000)
    }

    CancelAnimate(){
        clearInterval(this.animInterval);
    }

}