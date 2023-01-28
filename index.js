const { LaunchHTTPServer } = require('./dev.server')
const { FileManager } = require('./dev.generateStaticHtml')

LaunchHTTPServer();


/*
    Dynamic HTML File to be wathc
*/


(async () => {

    new FileManager(
        "contacts.html",
        "Contact - Cycle Zéro"
    ).WatchCompile();

    new FileManager(
        "index.html",
        "Cycle Zéro - Réemploi chantier"
    ).WatchCompile();

    new FileManager(
        "cgu.html",
        "Conditions Générales d'Utilisation - Cycle Zéro"
    ).WatchCompile();
    
})();
