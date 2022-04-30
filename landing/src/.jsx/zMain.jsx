// Const
const slideHeightCssVar = '--page-height';
const CSSHeightResize = () =>
    Engine.CSS.SetVar(slideHeightCssVar, window.innerHeight + "px");

// Init Call
if(Engine.JSEnable)
    CSSHeightResize();

Engine.OnReady(() => {

    if(Engine.CheckCompatibility() === false || !Engine.JSEnable)
        return;

    // shorcut
    const _E = Engine;
    const _Log = Engine.Console.Log;

    // Init

    SlideManager.Init({
        slideHeightCssVar : slideHeightCssVar
    });

    // event assign
    window.addEventListener('resize', CSSHeightResize);
    window.addEventListener('scroll', SlideManager.OnScroll)

});
