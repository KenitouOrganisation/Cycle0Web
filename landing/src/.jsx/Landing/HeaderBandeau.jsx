class HeaderBandeau{
    constructor(){
        this.bandeauHeight = 30;
        this.header = Engine.Q('header');
        this.nav = Engine.Q('nav', this.header);

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
        }
        
    }

    modifyHeader(){
        this.header.style.top = this.bandeauHeight + 'px'; 
    }

    render(){

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