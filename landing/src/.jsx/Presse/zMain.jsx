Engine.OnReady(async() =>{
    if (Engine.CheckCompatibility() === false || !Engine.JSEnable) return;
    Engine.Console.Log('Ready Presse');

    const listCoupDeCoeur = new PresseListArticle(
        presseListData_coupDeCoeur,
        Engine.Q('#coup-de-coeur .content')
    );
    listCoupDeCoeur.render();

    const listAutres = new PresseListArticle(
        presseListData_autres,
        Engine.Q('#autres-articles .content')
    );
    listAutres.sortByDate(true);
    listAutres.render();

});
