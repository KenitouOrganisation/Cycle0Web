const Engine = {};
Engine.JSEnable = false;

Engine.CheckCompatibility = function () {
    const value = !Object.defineProperty || !document.addEventListener;

    if (value === true)
        console.error(
            new Error(
                "The browser is not supported (too old or missing Javascript)"
            )
        );

    return !value;
};

Engine.Console = class _Console {
    static __dev__ = true;
    static Log(...args){
        if(_Console.__dev__ === true)
            console.log(...args);
    }
};

Engine.Alert = class _Alert {
    static Show({ title, message, style }) {
        alert(title + "\n\n" + message);
    }

    static Error(obj) {
        _Alert.Show(obj);
    }
};

(function () {
    // protected env for defining static/const attribute in Engine (make them not rewritable for safety)
    "use strict";

    if (Engine.CheckCompatibility() === false)
        return Engine.Alert.Error({
            title: "Navigateur incompatible",
            message:
                "Votre navigateur n'est pas supporté par notre site. Veuillez le mettre à jour ou changer de navigateur.",
        });

    function Define(obj, attrName, attrValue) {
        // const properties in obj : https://stackoverflow.com/questions/19744725/is-it-possible-to-create-read-only-members-in-javascript-object-literal-notation
        Object.defineProperty(obj, attrName, {
            // FIXME : weakspot, this function can be redefined and break the Engine code
            configurable: false,
            writable: false,
            enumerable: false,
            value: attrValue,
        });
    }

    // defining the Define function inside Engine as static function
    Define(Engine, "Define", Define);
    Define(Engine, "Def", function (attrName, attrValue) {
        return Define(Engine, attrName, attrValue);
    });
})();

Engine.CSS = {};
Engine.DOM = {};

Engine.AddJsAttr = function (elmt, jsAttrObj) {
    for (let name in jsAttrObj) {
        elmt[name] = jsAttrObj[name];
    }
};

/**
 *
 * @param {string} name
 * @param {Object} attr
 *      attr => { js-attr } for javascript attribute (doesn't appear on the html dom)
 * @param  {DOMElement} children
 * @returns element created
 */
Engine.Elmt = function (name, attr, ...children) {
    const elmt = document.createElement(name);
    for (let name in attr) {
        if (name == "data-js-attr") Engine.AddJsAttr(elmt, attr[name]);
        else elmt.setAttribute(name, attr[name]);
    }

    children.forEach((child) => {
        if (child instanceof Node) elmt.appendChild(child);
    });
    return elmt;
};

Engine.Q = (selector) => document.querySelector(selector);
Engine.QAll = (selector) => document.querySelectorAll(selector);

Engine.CSS._root = null;
Engine.CSS.SetVar = function (name, value) {
    if (!Engine.CSS._root) Engine.CSS._root = Engine.Q(":root");

    Engine.CSS._root.style.setProperty(name, value);
};

Engine.DOM._readyElement = "#ready";
Engine.DOM.OnReady = Engine.OnReady = (callback) => {
    document.addEventListener("DOMContentLoaded", (e) => {
        const interval = setInterval(() => {
            const readyElmt = Engine.Q(Engine.DOM._readyElement);
            if (readyElmt) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    });
};