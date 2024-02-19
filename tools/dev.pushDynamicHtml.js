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

    new FileManager(
        "privacy.html",
        "Politique de confidentialité - Cycle Zéro"
    ).WatchCompile();

    new FileManager(
        "legals.html",
        "Mentions légales - Cycle Zéro"
    ).WatchCompile();

    new FileManager(
        "chantiers.html",
        "Chantiers - Cycle Zéro"
    ).WatchCompile();
    
    new FileManager(
        "presse.html",
        "Presse - Cycle Zéro"
    ).WatchCompile();

    new FileManager(
        "faq.html",
        "FAQ - Cycle Zéro"
    ).WatchCompile();
    
}

module.exports = GenerateStaticHTML;

