const Engine = {};
Engine.JSEnable = true;
Engine.VERSION = {
  NUMBER: '1.0.3',
  DATE: '2023-06-25'
};
Engine.isMobileScreen = () => window.matchMedia("(max-width: 900px)").matches;
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
  static Error(...args) {
    if (_Console.__dev__ === true) console.error(...args);
  }
};
Engine.Alert = class _Alert {
  static Show({
    title = '',
    message,
    style
  }) {
    alert(title + "\n\n" + message);
  }
  static Error(obj) {
    _Alert.Show(obj);
    return false;
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
  Engine.ElmtLoopChildren(elmt, children);
  return elmt;
};
Engine.ElmtLoopChildren = function (parent, children) {
  children.forEach(child => {
    if (child instanceof Array) return Engine.ElmtLoopChildren(parent, child);
    if (child instanceof Node) parent.appendChild(child);
    if (typeof child == 'string') parent.innerHTML += child;
  });
};
Engine.Q = (selector, parent = null) => parent ? parent.querySelector(selector) : document.querySelector(selector);
Engine.QAll = (selector, parent) => parent ? parent.querySelectorAll(selector) : document.querySelectorAll(selector);
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
Engine.DOM.removeElmt = elmt => {
  elmt.parentNode.removeChild(elmt);
};
Engine.DOM.getRect = elmt => {
  const clientRect = elmt.getBoundingClientRect();
  return clientRect ? clientRect : {};
};
Engine.DOM.IsVisible = (elmt, strict = false) => {
  const clientRect = Engine.DOM.getRect(elmt);
  const isAbove = clientRect.top < 0;
  const isUnder = clientRect.top > window.innerHeight;
  const isLeft = clientRect.x < 0;
  const isRight = clientRect.x > window.innerWidth;
  return !isAbove && !isUnder && !isLeft && !isRight;
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
Engine.Ajax = class _Ajax {
  static async Fetch(url, options = {}) {
    try {
      return await fetch(url, options);
    } catch (err) {
      Engine.Console.Error(err);
      return null;
    }
  }
  static async FetchText(url, options = {}) {
    const req = await _Ajax.Fetch(url, options);
    if (req == null) return {};
    return {
      req: req,
      text: await req.text()
    };
  }
  static async FetchJSON(url, options = {}) {
    const rep = await _Ajax.FetchText(url, options);
    const req = rep.req;
    const repText = rep.text;
    try {
      return {
        req: req,
        json: JSON.parse(repText)
      };
    } catch (err) {
      if (repText == '') return {
        req: req,
        message: repText
      };
      return {
        req: req,
        error: err,
        json: {
          message: repText
        },
        message: repText
      };
    }
  }
};
Engine.WaitFor = function (ms = 0) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};
Engine.Observer = {};
Engine.Observer.Intersection = class {
  constructor(elmts, handleIntersect) {
    this.elmts = elmts instanceof Element ? [elmts] : elmts;
    this.callback = handleIntersect;
    this.prevRatio = 0.0;
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: this.buildThresholdList()
    };
    this.obs = new IntersectionObserver((entries, observer) => this.handleIntersect(entries, observer), options);
    for (let elmt of this.elmts) {
      this.obs.observe(elmt);
    }
  }
  handleIntersect(entries, observer) {
    entries.forEach(entry => {
      this.callback({
        isPrevious: entry.intersectionRatio > this.prevRatio,
        target: entry.target,
        entry: entry
      });
      this.prevRatio = entry.intersectionRatio;
    });
  }
  buildThresholdList() {
    let thresholds = [];
    let numSteps = 20;
    for (let i = 1.0; i <= numSteps; i++) {
      let ratio = i / numSteps;
      thresholds.push(ratio);
    }
    thresholds.push(0);
    return thresholds;
  }
  Destroy() {
    for (let elmt of this.elmts) {
      this.obs.unobserve(elmt);
    }
    Engine.Console.Log("Destroy observer");
  }
};
Engine.DebounceCall = class {
  constructor(invokeTime = 500) {
    this.timeout = null;
    this.invokeTime = invokeTime;
    this.lastTimeClicked = 0;
  }
  Invoke(callback) {
    if (Date.now() - this.lastTimeClicked > this.invokeTime) {
      console.log('------> Invoke accepted');
      callback();
    } else {
      console.log('------> Invoke rejected');
    }
    this.lastTimeClicked = Date.now();
  }
  InvokeAsync(callback) {
    return new Promise((req, rej) => {
      this.Invoke(async () => {
        req(callback ? await callback() : null);
      });
    });
  }
};
Engine.SwipeHandle = class {
  constructor(elmt, onSwipeEnd, onSwipeMove) {
    this.elmt = elmt;
    this.onSwipeEnd = onSwipeEnd;
    this.onSwipeMove = onSwipeMove;
    this.touchstart = {
      x: 0,
      y: 0
    };
    this.touchend = {
      x: 0,
      y: 0
    };
    this.isDestroyed = false;
    elmt.addEventListener('touchstart', e => this.SwipeStart(e));
    elmt.addEventListener('touchend', e => this.SwipeEnd(e));
    elmt.addEventListener('touchmove', e => this.SwipeMove(e));
  }
  SwipeStart(e) {
    if (this.isDestroyed) return e.stopImmediatePropagation();
    this.touchstart.x = e.changedTouches[0].screenX;
    this.touchstart.y = e.changedTouches[0].screenY;
  }
  SwipeEnd(e) {
    if (this.isDestroyed) return e.stopImmediatePropagation();
    this.touchend.x = e.changedTouches[0].screenX;
    this.touchend.y = e.changedTouches[0].screenX;
    this.onSwipeEnd(this.CheckHorizontalDirection());
  }
  SwipeMove(e) {
    if (this.isDestroyed) return e.stopImmediatePropagation();
    this.onSwipeMove({
      x: e.changedTouches[0].screenX - this.touchstart.x,
      y: e.changedTouches[0].screenY - this.touchstart.y
    });
  }
  CheckHorizontalDirection() {
    if (this.touchend.x < this.touchstart.x) return -1;
    if (this.touchend.x > this.touchstart.x) return 1;
  }
  CheckVerticalDirection() {
    if (this.touchend.y < this.touchstart.y) alert('swiped down!');
    if (this.touchend.y > this.touchstart.y) alert('swiped up!');
  }
  Destroy() {}
};
const chantiersListData_main = [{
  title: "RIVP",
  datetime: "",
  logo: "./src/img/illustrations/chantiers/rivp.png",
  link: "",
  data: {
    WORKSITE_QUANTITY: 4,
    WEIGHT: '23.3',
    CO2: '48266',
    GARBAGE: '74748',
    WATER: '226490306'
  }
}, {
  title: "Groupe IGS",
  datetime: "",
  logo: "./src/img/illustrations/chantiers/groupe_igs.jpg",
  link: "",
  data: {
    WORKSITE_QUANTITY: 1,
    WEIGHT: '15',
    CO2: '9450',
    GARBAGE: '7491',
    WATER: '24700708'
  }
}, {
  title: "NOBRA MENUISERIE",
  datetime: "",
  logo: "./src/img/illustrations/chantiers/nobra_menuiserie.png",
  link: "",
  data: {
    WORKSITE_QUANTITY: 1,
    WEIGHT: '4.8',
    CO2: '8500',
    GARBAGE: '6738',
    WATER: '22217568'
  }
}, {
  title: "COLAS",
  datetime: "",
  logo: "./src/img/illustrations/chantiers/colas.jpg",
  link: "",
  data: {
    WORKSITE_QUANTITY: 1,
    WEIGHT: '14.4',
    CO2: '18000',
    GARBAGE: '14269',
    WATER: '47048968'
  }
}, {
  title: "GYRARD GROUPE",
  datetime: "",
  logo: "./src/img/illustrations/chantiers/gyrard_groupe.jpg",
  link: "",
  data: {
    WORKSITE_QUANTITY: 1,
    WEIGHT: '0.5',
    CO2: '9572',
    GARBAGE: '26000',
    WATER: '75757576'
  }
}, {
  title: "DARRAS & JOUANIN FAYAT",
  datetime: "",
  logo: "./src/img/illustrations/chantiers/darras_jouanin.jpg",
  link: "",
  data: {
    WORKSITE_QUANTITY: 1,
    WEIGHT: '8',
    CO2: '10000',
    GARBAGE: '26000',
    WATER: '75757576'
  }
}];
class ChantiersListArticle {
  constructor(data, container) {
    this.data = data;
    this.container = container;
  }
  convertToFrenchDate(dateString) {
    try {
      const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
      };
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Date invalide");
      }
      const frenchDate = date.toLocaleDateString("fr-FR", options);
      return frenchDate;
    } catch (error) {
      console.error("Erreur lors de la conversion de la date :", error);
      return dateString;
    }
  }
  formatNumber(val) {
    return parseFloat(val).toLocaleString();
  }
  renderValueUnit(unitStr) {
    return Engine.Elmt("span", {
      style: "font-size: 13px;"
    }, unitStr);
  }
  renderCell(data) {
    const isMillion = parseFloat(data.value) > 999999;
    const value = isMillion ? this.formatNumber(parseInt(parseFloat(data.value) / 1000000)) + ' ' + this.renderValueUnit('millions').outerHTML : this.formatNumber(data.value);
    return Engine.Elmt("div", {
      class: "cell"
    }, Engine.Elmt("div", {
      class: "illustration"
    }, Engine.Elmt("img", {
      src: data.picto,
      alt: ""
    })), Engine.Elmt("div", {
      class: "data"
    }, Engine.Elmt("h2", {
      class: "h2"
    }, value, data.extendValue), Engine.Elmt("p", {
      class: "p2"
    }, data.unit)));
  }
  renderItem(item) {
    return Engine.Elmt("div", {
      class: "search-content-box"
    }, Engine.Elmt("div", {
      class: "header"
    }, item.logo && Engine.Elmt("img", {
      src: item.logo,
      alt: item.title,
      class: "logo"
    }), Engine.Elmt("div", null, Engine.Elmt("h2", {
      class: "h2 _txt_orange"
    }, item.data?.WORKSITE_QUANTITY > 1 ? item.data?.WORKSITE_QUANTITY + ' chantiers' : '1 chantier'), Engine.Elmt("p", {
      class: "_txt_orange",
      style: "font-size: 18px;"
    }, item.datetime && this.convertToFrenchDate(item.datetime)))), Engine.Elmt("div", {
      class: "content"
    }, Engine.Elmt("div", {
      class: "table left-box"
    }, Engine.Elmt("div", {
      class: "cell p1"
    }, "R\xE9sultats :"), this.renderCell({
      picto: './src/img/icons/Picto_Chantiers_01.png',
      value: item.data?.WEIGHT,
      extendValue: this.renderValueUnit(' t'),
      unit: 'de matériaux traités'
    }), this.renderCell({
      picto: './src/img/icons/Picto_Chantiers_03.png',
      value: item.data?.CO2,
      extendValue: this.renderValueUnit(' kg'),
      unit: 'de CO2 économisés'
    })), Engine.Elmt("div", {
      class: "table right-box"
    }, Engine.Elmt("div", {
      class: "cell p1"
    }, "L'\xE9quivalent de :"), this.renderCell({
      picto: './src/img/icons/Picto_Chantiers_04.png',
      value: item.data?.GARBAGE,
      extendValue: this.renderValueUnit(' kg'),
      unit: "d'ordures"
    }), this.renderCell({
      picto: './src/img/icons/Picto_Chantiers_02.png',
      value: item.data?.WATER,
      unit: "litres d'eau potable"
    }))));
  }
  renderContent() {
    const contentContainer = Engine.Elmt("div", {
      class: "container"
    });
    this.data.forEach(item => {
      contentContainer.appendChild(this.renderItem(item));
    });
    return contentContainer;
  }
  render() {
    this.container.replaceChildren(this.renderContent());
  }
}
Engine.OnReady(async () => {
  if (Engine.CheckCompatibility() === false || !Engine.JSEnable) return;
  Engine.Console.Log('Ready Chantiers');
  const listMain = new ChantiersListArticle(chantiersListData_main, Engine.Q('.search-content-container'));
  listMain.render();
});
