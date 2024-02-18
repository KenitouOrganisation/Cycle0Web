class HeaderBandeau{
    constructor(){
        this.enable = true;
        this.bandeauHeight = 30;
        this.header = Engine.Q('header');
        this.nav = Engine.Q('nav', this.header);
        this.headerMenu = Engine.Q('#header-menu', this.nav);

        this.containerStyle = {
            height: this.bandeauHeight + 'px',
            position: 'fixed',
            top: '0',
            left: '0',
            marginTop: 0,
            width: '100%',
            zIndex: 10001,
            backgroundColor: '#fff',
            fontSize: '1.2em',
            padding: '1px 0',
        }

        window.addEventListener('resize', ()=>{
            this.modifyHeader();
        });
        
    }

    modifyHeader(){
        if(!this.enable) return;

        this.header.style.top = (this.bandeauHeight) + 'px';

        // changing a property inside ::root element
        const currentHeaderHeight = Engine.CSS.GetVar('--header-height');
        const newHeaderHeight = Engine.MATH.WithUnit.Add(this.bandeauHeight.toString(), currentHeaderHeight);

        if(Engine.isMobileScreen())
            this.headerMenu.style.top = newHeaderHeight;
        else
            this.headerMenu.style.top = '';
    }

    render(){
        if(!this.enable) return;

        const container = (
            <div class="bandeau-box" style={this.containerStyle}></div>
        );

        const content =  (
            <div class="anim" style={{ 
                animationDelay: '3.5s',
            }}>
                <div class="bandeau-elmt" style={{
                    fontSize: '0.7em',
                    paddingRight: '200px',
                    color: 'var(--primary-color)'
                }}>
                    Chers amis Cycleurs, si par malheur vous seriez amené à ne pas trouver votre bonheur sur notre application, sachez que nous nous en excusons. Nous sommes fréquemment victimes de notre succès et pas encore disponibles dans toutes les régions (pour l'instant île-de-France, Haut de France et PACA), mais faisons tout notre possible afin de vous permettre de trouver (gratuitement) chaussure à votre pied.
                </div>
            </div>
        );

        this.modifyHeader();

        container.appendChild(content);
        container.appendChild(content.cloneNode(true));
        Engine.DOM.insertBefore(container, this.header);

    }
}