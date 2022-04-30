const Engine = {};
Engine.JSEnable = true;

Engine.CheckCompatibility = function () {
  const value = !Object.defineProperty || !document.addEventListener;
  if (value === true) console.error(new Error("The browser is not supported (too old or missing Javascript)"));
  return !value;
};

Engine.Console = class _Console {
  static __dev__ = true;

  static Log(...args) {
    if (_Console.__dev__ === true) console.log(...args);
  }

};
Engine.Alert = class _Alert {
  static Show({
    title,
    message,
    style
  }) {
    alert(title + "\n\n" + message);
  }

  static Error(obj) {
    _Alert.Show(obj);
  }

};

(function () {
  "use strict";

  if (Engine.CheckCompatibility() === false) return Engine.Alert.Error({
    title: "Navigateur incompatible",
    message: "Votre navigateur n'est pas supporté par notre site. Veuillez le mettre à jour ou changer de navigateur."
  });

  function Define(obj, attrName, attrValue) {
    Object.defineProperty(obj, attrName, {
      configurable: false,
      writable: false,
      enumerable: false,
      value: attrValue
    });
  }

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

Engine.Elmt = function (name, attr, ...children) {
  const elmt = document.createElement(name);

  for (let name in attr) {
    if (name == "data-js-attr") Engine.AddJsAttr(elmt, attr[name]);else elmt.setAttribute(name, attr[name]);
  }

  children.forEach(child => {
    if (child instanceof Node) elmt.appendChild(child);
  });
  return elmt;
};

Engine.Q = selector => document.querySelector(selector);

Engine.QAll = selector => document.querySelectorAll(selector);

Engine.CSS._root = null;

Engine.CSS.SetVar = function (name, value) {
  if (!Engine.CSS._root) Engine.CSS._root = Engine.Q(":root");

  Engine.CSS._root.style.setProperty(name, value);
};

Engine.DOM._readyElement = "#ready";

Engine.DOM.OnReady = Engine.OnReady = callback => {
  document.addEventListener("DOMContentLoaded", e => {
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
  if (force1 === null) return elmt.classList.contains(class1) ? (elmt.classList.add(class2), elmt.classList.remove(class1)) : (elmt.classList.add(class1), elmt.classList.remove(class2));
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
class ScrollContainer {
  construct({
    index,
    title,
    description,
    img,
    currentPage,
    totalPage
  }) {
    this._index = index;
    this._title = title;
    this._description = description;
    this._img = img;
    this._currentPage = currentPage;
    this._totalPage = totalPage;
  }

  ScrollMenu() {
    return Engine.Elmt("div", {
      class: "scroll_menu"
    }, Engine.Elmt("p", null, "Hello"), "s ", Engine.Elmt("br", null), Engine.Elmt("p", null, "OK boss"));
  }

}
class Slide {
  constructor() {}

}
const SlideManager = {};
SlideManager._elmt = {};
SlideManager._const = {
  _HEADER_ONTOP: "top",
  _HEADER_ONSCROLL: "scroll"
};
SlideManager.Header = {};

SlideManager.Header.SwitchState = (state = null) => {
  const header = SlideManager._elmt.header;
  if (state == "top") state = true;else if (state == "scroll") state = false;else return Engine.DOM.ClassSwitch(header, SlideManager._elmt._HEADER_ONTOP, SlideManager._elmt._HEADER_ONSCROLL);
  Engine.DOM.ClassSwitch(header, SlideManager._const._HEADER_ONTOP, SlideManager._const._HEADER_ONSCROLL, state);
};

SlideManager.OnScroll = () => {
  const currentScroll = window.scrollY;
  const totalScroll = window.scrollHeight;
  if (currentScroll == 0) SlideManager.Header.SwitchState('top');else SlideManager.Header.SwitchState('scroll');
};

SlideManager.Init = () => {
  SlideManager._elmt.header = Engine.Q("header");
  SlideManager.Header.SwitchState('top');
  let list = Array.from(Engine.QAll(".container"));
  SlideManager._elmt.containerList = list.filter(container => container.dataset.view != undefined);
};
const CSSHeightResize = () => Engine.CSS.SetVar("--page-height", window.innerHeight + "px");

if (Engine.JSEnable) CSSHeightResize();
Engine.OnReady(() => {
  if (Engine.CheckCompatibility() === false || !Engine.JSEnable) return;
  const _E = Engine;
  const _Log = Engine.Console.Log;
  SlideManager.Init();
  window.addEventListener('resize', CSSHeightResize);
  window.addEventListener('scroll', SlideManager.OnScroll);
});
