// Const
const CSSHeightResize = () =>
    Engine.CSS.SetVar("--page-height", window.innerHeight + "px");

// Init Call
if(Engine.JSEnable)
    CSSHeightResize();

Engine.OnReady(() => {

    if(Engine.CheckCompatibility() === false || !Engine.JSEnable)
        return;

    const _E = Engine;
    const _Log = Engine.Console.Log;

    window.addEventListener('resize', CSSHeightResize);

});
