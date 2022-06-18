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
    if (typeof child == 'string') elmt.innerHTML += child;
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

Engine.DOM.insertBefore = (newNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
};

Engine.DOM.insertAfter = (newNode, referenceNode) => {
  Engine.DOM.insertBefore(newNode, referenceNode.nextSibling);
};

Engine.DOM.getRect = elmt => {
  const clientRect = elmt.getBoundingClientRect();
  return clientRect ? clientRect : {};
};

Engine.DOM.IsVisible = (elmt, strict = false) => {
  const clientRect = Engine.DOM.getRect(elmt);
  const isAbove = clientRect.top < 0;
  const isUnder = clientRect.top > window.innerHeight;
  return !isAbove && !isUnder;
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
    }, Engine.Elmt("p", null, "Hello"), "s ", Engine.Elmt("br", null), Engine.Elmt("p", null, "OK boss"), Engine.Elmt("div", {
      class: "scro"
    }, Engine.Elmt("div", {
      class: "verti"
    }, Engine.Elmt("div", {
      class: "center"
    }, Engine.Elmt("p", null, "Nice test")))));
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

  GetDataset(key = "") {
    const dataset = this._elmt.dataset;
    if (key == "") return dataset;
    key = key.toLowerCase();

    try {
      const val = dataset[key];
      return val ? val : "";
    } catch (err) {
      console.error(err);
      return "";
    }
  }

  GetSlideId() {
    return this._elmt.dataset.view;
  }

  GetPagingId() {
    return this._elmt.dataset.paging;
  }

  Show() {
    this.isHided = false;
    Engine.DOM.ClassSwitch(this._elmt, this._const._SLIDE_SHOW, this._const._SLIDE_HIDE, true);
  }

  Hide() {
    this.isHided = true;
    Engine.DOM.ClassSwitch(this._elmt, this._const._SLIDE_SHOW, this._const._SLIDE_HIDE, false);
  }

  ChangeToAbsolute(toAbsolute = true) {
    if (toAbsolute) return this._elmt.classList.add('absolute');
    return this._elmt.classList.remove('absolute');
  }

  SearchChild(selector) {
    return this._elmt.querySelectorAll(selector);
  }

  GetTextBox() {
    return this.SearchChild('.text-box');
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
SM.lastSlideUnlocked = false;
SM.Header = {};
SM.ignoringLastSlideScroll = false;
SM.Paging = {};

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
  Engine.DOM.insertAfter(newNode = SM._elmt.fakeSpace, referenceNode = SM.SlideIndex({
    last: true
  })._elmt);
  SM.ShowSlide(SM.currentSlide);
  SM.SetFakeSpace();
  SM.slideList.forEach(slider => {
    const textBox = Array.from(slider.GetTextBox());
    let priority = 1;
    textBox.forEach(box => {
      box.classList.add('priority');
      box.classList.add('_' + priority);
      if (priority == 1) priority = 2;
    });
  });
  SM.Paging.Init();
  SM.OnScroll({
    target: document
  });
};

SM.Header.SwitchState = (state = null) => {
  state = state == "top" ? true : state;
  state = state == "scroll" ? false : state;
  const header = SM._elmt.header;
  Engine.DOM.ClassSwitch(header, SM._const._HEADER_ONTOP, SM._const._HEADER_ONSCROLL, state);
};

SM.OnScroll = e => {
  const scrollingElmt = e.target.scrollingElement;
  const currentScroll = scrollingElmt.scrollTop;
  const totalScroll = scrollingElmt.scrollHeight;
  const slideHeight = parseInt(SM.GetSlideHeight());
  const slidePosition = Math.floor(currentScroll / slideHeight);
  const currentSlide = Engine.MATH.Bounded({
    min: 0,
    max: SM.slideList.length - 1,
    value: slidePosition
  });
  if (currentSlide == SM.currentSlide) return;
  SM.ShowSlide(currentSlide);
  SM.currentSlide = currentSlide;
  SM.Paging.OnScroll();
  if (SM.currentSlide == 0) SM.Header.SwitchState("top");else SM.Header.SwitchState("scroll");
  const lastSlide = SM.slideList[SM.slideList.length - 1];

  if (SM.lastSlideUnlocked != true && SM.LastSlideReach() === true) {
    SM.lastSlideUnlocked = true;
    Engine.DOM.insertBefore(SM._elmt.fakeSpace, lastSlide._elmt);
    lastSlide.ChangeToAbsolute(true);
    if (SM.ignoringLastSlideScroll !== true) lastSlide._elmt.scrollIntoView(true);else SM.ignoringLastSlideScroll = false;
  } else if (SM.lastSlideUnlocked != false && SM.LastSlideReach() !== true) {
    SM.lastSlideUnlocked = false;
    lastSlide.ChangeToAbsolute(false);
  }
};

SM.OnResize = () => {
  SM.SetFakeSpace();
};

SM.SlideIndex = index => {
  if (index.last && index.last == true) index = SM.slideList.length - 1;
  const slide = SM.slideList[index];
  return slide ? slide : {};
};

SM.ShowSlide = slideNumber => {
  SM.slideList.map(slide => {
    if (slideNumber == slide.GetSlideId()) {
      slide.Show();
    } else slide.Hide();
  });
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

SM.LastSlideReach = () => {
  return SM.currentSlide == SM.slideList.length - 1;
};

SM.JumpTo = slideIdx => {
  slideIdx = Engine.MATH.Bounded({
    min: 0,
    max: SM.slideList.length - 1,
    value: slideIdx
  });
  const slideHeight = parseInt(SM.GetSlideHeight());
  const targetScroll = Math.ceil(slideIdx * slideHeight);
  document.scrollingElement.scrollTo({
    top: targetScroll,
    left: 0,
    behavior: "smooth"
  });
};

SM.JumpForward = () => {
  SM.JumpTo(SM.currentSlide + 1);
};

SM._elmt._paging = {};
SM.Paging.list = [];

SM.Paging.Init = () => {
  let list = Array.from(Engine.QAll(".container"));
  list = list.filter(container => container.dataset.paging != undefined);
  SM.Paging.list = list;
  SM._elmt._paging.dots = Engine.Elmt("div", {
    id: "dots"
  });

  for (let i = 0; i < list.length; i++) {
    const idx = i + 1;
    const dot = Engine.Elmt("div", {
      class: "dot",
      "data-index": idx,
      "data-js-attr": {
        onclick: () => {
          const target = SM.slideList.filter(slide => slide.GetPagingId() == idx);
          if (target.length < 1) return;
          SM.JumpTo(target[0].GetSlideId());
        }
      }
    });

    SM._elmt._paging.dots.appendChild(dot);
  }

  SM._elmt._paging.text = Engine.Elmt("p", {
    class: "p_2"
  });
  SM._elmt._paging.container = Engine.Elmt("div", {
    id: "paging-box",
    class: "horizontal _dark"
  }, SM._elmt._paging.dots, Engine.Elmt("div", {
    class: "next",
    title: "Suivant",
    "data-js-attr": {
      onclick: () => SM.JumpForward()
    }
  }, SM._elmt._paging.text, Engine.Elmt("img", {
    src: "./src/img/arrow-bottom.png",
    alt: "\uD83E\uDC73",
    class: "arrow-bottom",
    width: "16px"
  })));
  document.body.appendChild(SM._elmt._paging.container);
  SM.Paging.OnScroll();
};

SM.Paging.OnScroll = (currentSlide = SM.currentSlide) => {
  const slide = SM.slideList[currentSlide];
  const _paging = SM._elmt._paging;
  if (slide.GetDataset("pagingOn") == "false") return Engine.DOM.ClassSwitch(_paging.container, 'hide', 'show', true);
  Engine.DOM.ClassSwitch(_paging.container, 'hide', 'show', false);

  _paging.text.replaceChildren(Engine.Elmt("span", null, slide.GetDataset("pagingText")));

  const pagingIdx = slide.GetDataset("paging");
  if (!pagingIdx) return Engine.DOM.ClassSwitch(_paging.dots, 'hide', 'show', true);
  Engine.DOM.ClassSwitch(_paging.dots, 'hide', 'show', false);

  SM._elmt._paging.dots.childNodes.forEach(dot => {
    const idx = dot.dataset.index;
    if (idx != pagingIdx) Engine.DOM.ClassSwitch(dot, 'off', 'on', true);else Engine.DOM.ClassSwitch(dot, 'off', 'on', false);
  });
};
const Init = {};

Init.JSOnFlag = () => {
  document.body.classList.add("js-on");
};

Init.CenterBodyBkground = () => {
  const bkgroundElmt = Engine.Q("#body-background");
  const bodyRect = Engine.DOM.getRect(document.body);
  const centerPos = bodyRect.height / 2;
  bkgroundElmt.style.top = centerPos + "px";
};

Init.AnchorLinkScrollManaged = () => {
  const targetIdAnchor = "pre-inscription";
  const targetElmt = Engine.Q("#" + targetIdAnchor);
  let buttonList = Engine.QAll(`a[href="#${targetIdAnchor}"]`);
  buttonList = Array.from(buttonList);
  buttonList.forEach(btt => {
    btt.addEventListener("click", e => {
      e.preventDefault();
      SlideManager.JumpTo(Infinity);
      SlideManager.ignoringLastSlideScroll = true;
    });
  });
};

Init.IgnoringLastSlideScroll = () => {
  if (document.location.hash != "") SlideManager.ignoringLastSlideScroll = true;
};

const InitManual = {};

InitManual.AssignAnimationWhenVisible = () => {
  const animBox = Array.from(Engine.QAll('.anim-box'));
  const className = {
    _ON_VISIBLE: 'show',
    _ON_HIDE: 'hide'
  };
  animBox.forEach(box => {
    if (Engine.DOM.IsVisible(box) === true) Engine.DOM.ClassSwitch(box, className._ON_VISIBLE, className._ON_HIDE, true);else Engine.DOM.ClassSwitch(box, className._ON_VISIBLE, className._ON_HIDE, false);
  });
};
const slideHeightCssVar = "--page-height";

const CSSHeightResize = () => Engine.CSS.SetVar(slideHeightCssVar, window.innerHeight + "px");

if (Engine.JSEnable) CSSHeightResize();
Engine.OnReady(() => {
  if (Engine.CheckCompatibility() === false || !Engine.JSEnable) return;
  const _E = Engine;
  const _Log = Engine.Console.Log;

  for (let initFunc in Init) {
    try {
      Init[initFunc]();
    } catch (err) {
      console.error(err);
    }
  }

  SlideManager.Init({
    slideHeightCssVar: slideHeightCssVar
  });

  function OnResize() {
    CSSHeightResize();
    SlideManager.OnResize();
  }

  function OnScroll(e) {
    SlideManager.OnScroll(e);
    InitManual.AssignAnimationWhenVisible();
  }

  window.addEventListener("resize", OnResize);
  window.addEventListener("scroll", OnScroll);
});

function CenterBodyBackground() {}
