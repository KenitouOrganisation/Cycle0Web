const Engine = {};
Engine.JSEnable = true;

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
    static Log(...args) {
        if (_Console.__dev__ === true) console.log(...args);
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
    // FIXME obsolete
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
Engine.MATH = {};
Engine.MATH.WithUnit = {};

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
        if (typeof child == 'string') elmt.innerHTML += child;
    });
    return elmt;
};

Engine.Q = (selector) => document.querySelector(selector);
Engine.QAll = (selector) => document.querySelectorAll(selector);

Engine.CSS._root = null;
Engine.CSS.InitRoot = function () {
    if (!Engine.CSS._root) Engine.CSS._root = Engine.Q(":root");
};
Engine.CSS.SetVar = function (name, value) {
    Engine.CSS.InitRoot();
    Engine.CSS._root.style.setProperty(name, value);
};
Engine.CSS.GetVar = function (name) {
    Engine.CSS.InitRoot();
    return Engine.CSS._root.style.getPropertyValue(name);
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

Engine.DOM.ClassSwitch = (elmt, class1, class2, force1 = null) => {
    if (force1 === null)
        return elmt.classList.contains(class1)
            ? (elmt.classList.add(class2), elmt.classList.remove(class1))
            : (elmt.classList.add(class1), elmt.classList.remove(class2));

    let temp1, temp2;

    if (force1 === true) {
        temp1 = class1;
        temp2 = class2;
    } else {
        temp1 = class2;
        temp2 = class1;
    }

    elmt.classList.add(temp1);
    elmt.classList.remove(temp2);
};

Engine.DOM.insertBefore = (newNode, referenceNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
};

Engine.DOM.insertAfter = (newNode, referenceNode) => {
    Engine.DOM.insertBefore(newNode, referenceNode.nextSibling);
};

Engine.DOM.getRect = (elmt) => {
    const clientRect = elmt.getBoundingClientRect();
    return clientRect ? clientRect : {};
};

Engine.DOM.IsVisible = (elmt, strict = false) => {
    const clientRect = Engine.DOM.getRect(elmt);
    const isAbove = clientRect.top < 0;
    const isUnder = clientRect.top > window.innerHeight;

    return !isAbove && !isUnder;
};


Engine.MATH.WithUnit.SplitValue = (valStr) => {
    return valStr.split(/([0-9.]+)/); // return ["", "number", "unit"]
};

Engine.MATH.WithUnit.Multiply = (number, valStr) => {
    const val = Engine.MATH.WithUnit.SplitValue(valStr);

    // preventing undefined or null value, that cause NaN
    if (!val[1]) val[1] = 1;

    if (!val[2]) val[2] = "";

    const result = number * val[1];
    return result + val[2];
};

Engine.MATH.Bounded = ({ value, min, max }) => {
    if (min && value < min) return min;
    if (max && value > max) return max;
    return value;
};
