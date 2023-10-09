class CarteFrance
{
    constructor(){
        this.container = Engine.Q('#les-chiffres-map-carte');
        this.LoadSVG();
    }

    async LoadSVG(){
        const req = await fetch('./src/img/illustrations/carte-france.svg');
        const svg = await req.text();
        
        this.container.innerHTML = svg;
    }
}