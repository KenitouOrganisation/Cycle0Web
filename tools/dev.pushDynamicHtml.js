const { FileManager } = require('./dev.generateStaticHtml')

/*
    Dynamic HTML File to be wathc
*/


async function GenerateStaticHTML(){

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
    
}

module.exports = GenerateStaticHTML;
