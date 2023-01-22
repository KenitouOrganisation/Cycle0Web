// function to be Init on page ready
const Init = {};

Init.GalleryContainerShowOnScroll = ()=>{

    new GalleryBox(
        Engine.QAll('.gallery-container')
    );

};

Init.BandeauAnimate = ()=>{
    new Bandeau(Engine.Q('.bandeau-box')).Animate()

};