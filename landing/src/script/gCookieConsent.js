// obtain plugin
var cc = initCookieConsent();

// run plugin with your configuration
cc.run({
    revision: 0,                            // to be used when changing the cookies settings and need the user to reconfirm the consent
    current_lang: "fr",
    autoclear_cookies: true, // default: false
    page_scripts: true, // default: false

    // mode: 'opt-in'                          // default: 'opt-in'; value: 'opt-in' or 'opt-out'
    // delay: 0,                               // default: 0
    auto_language: null,                     // default: null; could also be 'browser' or 'document'
    // autorun: true,                          // default: true
    // force_consent: false,                   // default: false
    hide_from_bots: true,                   // default: true
    // remove_cookie_tables: false             // default: false
    // cookie_name: 'cc_cookie',               // default: 'cc_cookie'
    // cookie_expiration: 182,                 // default: 182 (days)
    // cookie_necessary_only_expiration: 182   // default: disabled
    // cookie_domain: location.hostname,       // default: current domain
    // cookie_path: '/',                       // default: root
    // cookie_same_site: 'Lax',                // default: 'Lax'
    // use_rfc_cookie: false,                  // default: false
    // revision: 0,                            // default: 0

    onFirstAction: function (user_preferences, cookie) {
        // callback triggered only once
    },

    onAccept: function (cookie) {
        // ...
    },

    onChange: function (cookie, changed_preferences) {
        // ...
    },

    languages: {
        fr: {
            consent_modal: {
                title: "Les cookies 🍪",
                description:
                    "En continuant sur notre site, vous acceptez l'utilisation de cookies nécessaires au bon fonctionnement de celui-ci.",
                primary_btn: {
                    text: "Tout accepter",
                    role: "accept_all", // 'accept_selected' or 'accept_all'
                },
                secondary_btn: {
                    text: "Options",
                    role: "settings", // 'settings' or 'accept_necessary'
                },
            },
            settings_modal: {
                title: "Vos préférences",
                save_settings_btn: "Sauvegarder",
                accept_all_btn: "Tout accepter",
                reject_all_btn: "Tout refuser",
                close_btn_label: "Fermer",
                cookie_table_headers: [
                    { col1: "Name" },
                    { col2: "Domain" },
                    { col3: "Expiration" },
                    { col4: "Description" },
                ],
                blocks: [
                    {
                        title: "Utilisation des cookies 📢",
                        description:
                            'Nous utilisons des cookies pour garantir les fonctionnalités de base du site web et améliorer votre expérience en ligne. Vous pouvez choisir d\'accepter ou de refuser chaque catégorie de cookies à tout moment. Pour plus de détails concernant les cookies et les autres données sensibles, veuillez consulter notre <a href="./cgu.html" class="cc-link">politique de confidentialité</a> complète.',
                    },
                    {
                        title: "Cookies strictement nécessaire",
                        description:
                            "Ces cookies sont essentiels au bon fonctionnement du site. Ils ne sont pas partagés avec des tiers et restent strictement sur notre site. Vous pouvez toutefois supprimer ces cookies via des outils fournis par votre navigateur, mais cela peut affecter la fonctionnalité du site.",
                        toggle: {
                            value: "necessary",
                            enabled: true,
                            readonly: true, // cookie categories with readonly=true are all treated as "necessary cookies"
                        },
                    },
                    {
                        title: "Cookies d'analyse et de performance",
                        description:
                            "Nous utilisons des cookies de performance et d'analyse, pour collecter des informations anonymes sur l'utilisation de notre site web. Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site, à améliorer ses performances et à optimiser notre contenu. Les données recueillies par ces cookies ne permettent pas de vous identifier personnellement.",
                        toggle: {
                            value: "analytics", // your cookie category
                            enabled: true,
                            readonly: false,
                        },
                        // cookie_table: [
                        //     // list of all expected cookies
                        //     {
                        //         col1: "^_ga", // match all cookies starting with "_ga"
                        //         col2: "google.com",
                        //         col3: "2 years",
                        //         col4: "description ...",
                        //         is_regex: true,
                        //     },
                        //     {
                        //         col1: "_gid",
                        //         col2: "google.com",
                        //         col3: "1 day",
                        //         col4: "description ...",
                        //     },
                        // ],
                    },
                    // on n'en a pas pour le moment
                    // {
                    //     title: "Cookies de suivi",
                    //     description:
                    //         "Sur notre site, nous intégrons des vidéos provenant de services tiers. Ces vidéos peuvent utiliser des cookies de suivi afin de collecter des informations sur votre utilisation et votre interaction avec la vidéo. Ces cookies sont placés et gérés par les fournisseurs tiers, conformément à leurs propres politiques de confidentialité. Vous avez le choix d'accepter ou de refuser ces cookies tiers. Veuillez noter que si vous les refusez, certaines fonctionnalités liées aux vidéos tierces pourraient ne pas être disponibles. Pour en savoir plus sur l'utilisation des cookies par les fournisseurs tiers et vos options de gestion, veuillez consulter leurs politiques de confidentialité respectives.",
                    //     toggle: {
                    //         value: "targeting",
                    //         enabled: true,
                    //         readonly: false,
                    //     },
                    // },
                    {
                        title: "Plus d'informations",
                        description:
                            'Pour plus d\'informations, vous pouvez lire notre <a class="cc-link" href="./privacy.html">politique de confidentialité</a>.',
                    },
                ],
            },
        },
    },
});
