class HeaderBandeau{
    constructor(){
        this.enable = false;
        this.bandeauHeight = 30;
        this.header = Engine.Q('header');
        this.nav = Engine.Q('nav', this.header);
        this.headerMenu = Engine.Q('#header-menu', this.nav);
        this.wrapContent = Engine.Q('.wrap-content');

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

        // the message will be displayed after the 19th of February 2024 at 3:00
        const currentDate = new Date();
        const targetDate = new Date('2024-02-19 03:00:00');
        const maxDate = new Date('2024-03-04 03:00:00');
        if(currentDate => targetDate && currentDate <= maxDate){
            this.enable = true;
        }
        
    }

    modifyHeader(){
        if(!this.enable) return;

        this.header.style.top = (this.bandeauHeight) + 'px';

        // changing a property inside ::root element
        const currentHeaderHeight = Engine.CSS.GetVar('--header-height');
        const newHeaderHeight = Engine.MATH.WithUnit.Add(this.bandeauHeight.toString(), currentHeaderHeight);

        if(Engine.isMobileScreen()){
            this.headerMenu.style.top = newHeaderHeight;
            this.wrapContent.style.marginTop = Engine.MATH.WithUnit.Add(newHeaderHeight, '15');
        }
        else{
            this.headerMenu.style.top = '';
            this.wrapContent.style.marginTop = '';
        }
            
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
                    Chers amis Cycleurs, si par malheur vous étiez amenés à ne pas trouver votre bonheur sur notre application, sachez que nous nous en excusons. Nous sommes fréquemment victimes de notre succès et pas encore disponibles dans toutes les régions (pour l'instant Île-de-France, Haut-de-France et PACA), mais faisons tout notre possible afin de vous permettre de trouver (gratuitement) chaussure à votre pied.
                </div>
            </div>
        );

        this.modifyHeader();

        container.appendChild(content);
        container.appendChild(content.cloneNode(true));
        Engine.DOM.insertBefore(container, this.header);

    }
}