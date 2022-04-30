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
Engine.MATH = {};
Engine.MATH.WithUnit = {};

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

Engine.DOM.insertAfter = (newNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

Engine.MATH.WithUnit.SplitValue = valStr => {
  return valStr.split(/([0-9.]+)/);
};

Engine.MATH.WithUnit.Multiply = (number, valStr) => {
  const val = Engine.MATH.WithUnit.SplitValue(valStr);
  if (!val[1]) val[1] = 1;
  if (!val[2]) val[2] = "";
  const result = number * val[1];
  return result + val[2];
};

Engine.MATH.Bounded = ({
  value,
  min,
  max
}) => {
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
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
  constructor(nodeElmt) {
    this._const = {
      _SLIDE_SHOW: "slide-show",
      _SLIDE_HIDE: "slide-hide"
    };
    this._elmt = nodeElmt;
    this.isHided = false;
  }

  GetSlideId() {
    return this._elmt.dataset.view;
  }

  Show() {
    this.isHided = false;
    Engine.DOM.ClassSwitch(this._elmt, this._const._SLIDE_SHOW, this._const._SLIDE_HIDE, true);
  }

  Hide() {
    this.isHided = true;
    Engine.DOM.ClassSwitch(this._elmt, this._const._SLIDE_SHOW, this._const._SLIDE_HIDE, false);
  }

}
const SlideManager = {};
const SM = SlideManager;
SM._elmt = {};
SM._const = {
  _HEADER_ONTOP: "top",
  _HEADER_ONSCROLL: "scroll"
};
SM.slideList = [];
SM.currentSlide = 0;
SM.Header = {};

SM.Init = ({
  slideHeightCssVar
}) => {
  SM._const._SLIDE_HEIGHT_CSS_VAR = slideHeightCssVar;
  SM._elmt.header = Engine.Q("header");
  SM.Header.SwitchState("top");
  let list = Array.from(Engine.QAll(".container"));
  list = list.filter(container => container.dataset.view != undefined);
  list.map(container => {
    const newSlide = new Slide(container);
    SM.slideList.push(newSlide);
  });
  SM._elmt.viewContainer = Engine.Q("#view");
  SM._elmt.fakeSpace = Engine.Elmt("div", {
    id: "fake-space",
    class: "container"
  }, Engine.Elmt("div", {
    class: "vertical center-box"
  }));
  SM.ShowSlide(SM.currentSlide);
};

SM.Header.SwitchState = (state = null) => {
  const header = SM._elmt.header;
  Engine.DOM.ClassSwitch(header, SM._const._HEADER_ONTOP, SM._const._HEADER_ONSCROLL, false);
  return;

  if (state != null) {
    if (state == SM._elmt._HEADER_ONTOP) state = true;else if (state == SM._elmt._HEADER_ONSCROLL) state = false;else state = null;
  }

  Engine.DOM.ClassSwitch(header, SM._const._HEADER_ONTOP, SM._const._HEADER_ONSCROLL, state);
};

SM.OnScroll = e => {
  const scrollingElmt = e.target.scrollingElement;
  const currentScroll = scrollingElmt.scrollTop;
  const totalScroll = scrollingElmt.scrollHeight;
  const slideHeight = SM.GetSlideHeight();
  const slidePosition = Math.round(currentScroll / parseInt(slideHeight));
  if (currentScroll == 0) SM.Header.SwitchState("top");else SM.Header.SwitchState("scroll");
  const currentSlide = Engine.MATH.Bounded({
    min: 0,
    max: SM.slideList.length,
    value: slidePosition
  });
  if (currentSlide != SM.currentSlide) SM.ShowSlide(currentSlide);
  SM.currentSlide = currentSlide;
};

SM.OnResize = () => {};

SM.SlideIndex = index => {
  const slide = SM.slideList[index];
  return slide ? slide : {};
};

SM.ShowSlide = slideNumber => {
  SM.slideList.map(slide => {
    if (slideNumber == slide.GetSlideId()) {
      slide.Show();
      Engine.DOM.insertAfter(SM._elmt.fakeSpace, slide._elmt);
    } else slide.Hide();
  });
  SM.SetFakeSpace();
};

SM.SetSlideHeight = value => {
  Engine.CSS.SetVar(SM._const._SLIDE_HEIGHT_CSS_VAR, value);
};

SM.GetSlideHeight = () => {
  return Engine.CSS.GetVar(SM._const._SLIDE_HEIGHT_CSS_VAR);
};

SM.SetFakeSpace = () => {
  const hidedSlideNb = SM.slideList.length;
  const totalHeight = Engine.MATH.WithUnit.Multiply(hidedSlideNb, SM.GetSlideHeight());
  SM._elmt.fakeSpace.style.height = totalHeight;
};
const slideHeightCssVar = '--page-height';

const CSSHeightResize = () => Engine.CSS.SetVar(slideHeightCssVar, window.innerHeight + "px");

if (Engine.JSEnable) CSSHeightResize();
Engine.OnReady(() => {
  if (Engine.CheckCompatibility() === false || !Engine.JSEnable) return;
  const _E = Engine;
  const _Log = Engine.Console.Log;
  SlideManager.Init({
    slideHeightCssVar: slideHeightCssVar
  });
  window.addEventListener('resize', CSSHeightResize);
  window.addEventListener('scroll', SlideManager.OnScroll);
});
