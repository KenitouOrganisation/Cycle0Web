// Const
const slideHeightCssVar = "--page-height";
const CSSHeightResize = () =>
    Engine.CSS.SetVar(slideHeightCssVar, window.innerHeight + "px");

// Init Call
if (Engine.JSEnable) CSSHeightResize();

Engine.OnReady(() => {
    if (Engine.CheckCompatibility() === false || !Engine.JSEnable) return;

    // shorcut
    const _E = Engine;
    const _Log = Engine.Console.Log;

    // Init

    for (let initFunc in Init) {
        try {
            Init[initFunc]();
        } catch (err) {
            console.error(err);
        }
    }

    SlideManager.Init({
        slideHeightCssVar: slideHeightCssVar,
    });


    // grouping instructions
    function OnResize() {
        CSSHeightResize();
        SlideManager.OnResize();
    }

    function OnScroll(e){
        SlideManager.OnScroll(e);
        InitManual.AssignAnimationWhenVisible();
    }

    // event assign
    window.addEventListener("resize", OnResize);
    window.addEventListener("scroll", OnScroll);
});

function CenterBodyBackground() {}
