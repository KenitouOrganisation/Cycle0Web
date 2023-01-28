const { LaunchHTTPServer } = require('./dev.server')
const { FileManager } = require('./dev.generateStaticHtml')

LaunchHTTPServer();


/*
    Dynamic HTML File to be wathc
*/


(async () => {

    new FileManager(
        "contacts.html",
        "Cycle Zéro - Contact"
    ).WatchCompile();

    new FileManager(
        "index.html",
        "Cycle Zéro - Réemploi chantier"
    ).WatchCompile();
    
})();
