const Engine = {}

Engine.CheckCompatibility = function(){
    const value = !Object.defineProperty || !document.addEventListener;

    if(value === true)
        console.error(new Error('The browser is not supported (too old or missing Javascript)'));

    return value;
};

Engine.Alert = class _Alert
{
    static Show({ title, message, style }){
        alert(title  + "\n\n" + message);
    }

    static Error(obj){
        _Alert.Show(obj);
    }
};

(function(){
    // protected env for defining static/const attribute in Engine (make them not rewritable for safety)
    'use strict';


    if(Engine.CheckCompatibility() === true)
        return Engine.Alert.Error({
            title : 'Navigateur incompatible',
            message : "Votre navigateur n'est pas supporté par notre site. Veuillez le mettre à jour ou changer de navigateur."
        });

    function Define(obj, attrName, attrValue){
        // const properties in obj : https://stackoverflow.com/questions/19744725/is-it-possible-to-create-read-only-members-in-javascript-object-literal-notation
        Object.defineProperty(obj, attrName, {  // FIXME : weakspot, this function can be redefined and break the Engine code
            configurable: false,
            writable: false,
            enumerable : false,
            value: attrValue
        });
    }

    // defining the Define function inside Engine as static function
    Define(Engine, 'Define', Define);
    Define(Engine, 'Def', function(attrName, attrValue){
        return Define(Engine, attrName, attrValue)
    });
})();


function _AddJsAttr(elmt, jsAttrObj){
    for(let name in jsAttrObj){
        elmt[name] = jsAttrObj[name]
    }
}

/**
 * 
 * @param {string} name 
 * @param {Object} attr 
 *      attr => { js-attr } for javascript attribute (doesn't appear on the html dom)
 * @param  {DOMElement} children 
 * @returns element created
 */
Engine.Elmt = function (name, attr, ...children){

    const elmt = document.createElement(name);
    for(let name in attr){
        if(name == 'js-attr')
            _AddJsAttr(elmt, attr[name])
        else
            elmt.setAttribute(name, attr[name]);
    }

    children.forEach(child => {
        if(child instanceof Node)
            elmt.appendChild(child)
        
    });
    return elmt;

};