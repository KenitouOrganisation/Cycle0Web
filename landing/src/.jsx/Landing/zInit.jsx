// function to be Init on page ready
const Init = {};

Init.GalleryContainerShowOnScroll = ()=>{

    let mobile = Engine.isMobileScreen();
    const box = new GalleryBox(
        Engine.QAll('.gallery-container')
    );

    
    window.addEventListener('resize', ()=>{

        const isMobile = Engine.isMobileScreen();

        // when we switch paltform view
        if(mobile != isMobile){
            // we only destroy when we switch from mobile to computer
            if(!isMobile)
                box.Destroy();
                
            box.Init();
            mobile = isMobile;
        }
    })

};

/*Init.BandeauAnimate = ()=>{
    new Bandeau(Engine.Q('.bandeau-box')).Animate()

};*/

Init.CreateHashtagsBandeau = ()=>{
    new Bandeau().Render();
}

Init.CustomAlert = ()=>{
    CustomAlertOnReady ? CustomAlertOnReady() : null;
}