const fetcher = new FetchData();
fetcher.Init();

Engine.OnReady(async() =>{

    Engine.Console.Log('Ready Licenses', fetcher);



    await fetcher.onReady();
    RenderLicenses.renderAll(fetcher);


});