Engine.OnReady(() => {
    if (Engine.CheckCompatibility() === false || !Engine.JSEnable) return;

    // shorcut
    const _E = Engine;
    const _Log = _E.Console.Log;
    //_E.Console.__dev__ = false;

    // Init
    for (let initFunc in Init) {
        try {
            Init[initFunc]();
        } catch (err) {
            console.error(err);
        }
    }

    _Log("Ready")

});