const fetcher = new FetchData();
fetcher.onReadyMob()
    .then(()=>{
        fetcher.Init();
    });

Engine.OnReady(async() =>{
    Engine.Console.Log('Ready Licenses');
    const pgr_bar = Engine.Q('#pgr_bar');

    document.write(Object)

    await fetcher.onReady();
    Engine.Console.Log('Ready Fetch')

    RenderLicenses.renderAll(fetcher);
    pgr_bar.style.display = 'none';

});