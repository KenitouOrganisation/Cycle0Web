const Engine = {};
Engine.JSEnable = true;
Engine.VERSION = {
  NUMBER: '1.0.2',
  DATE: '2023-02-04'
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

  children.forEach(child => {
    if (child instanceof Node) elmt.appendChild(child);
    if (typeof child == 'string') elmt.innerHTML += child;
  });
  return elmt;
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
class Bandeau {
  constructor() {
    this.elmt = Engine.Q('#bandeau-hashtags');
    this.keywords = ["synergie", "urbanisme bas carbone", "frugalité", "sobriété", "Économie circulaire", "Écologie", "Valorisation", "Sobriété Réemploi", "Construction", "BTP", "Antigaspi", "Innovation ESS", "Chantier", "Zéro déchet"];
  }

  Render() {
    const container = Engine.Elmt("div", {
      class: "anim"
    });
    const imgNo = [14, 11, 12, 10, '08', '09'];
    this.keywords.forEach((keyword, index) => {
      const elmt = Engine.Elmt("div", {
        class: "bandeau-elmt"
      }, Engine.Elmt("img", {
        src: `./src/img/icons/Picto_Or_${imgNo[index % imgNo.length]}.png`,
        alt: keyword
      }), Engine.Elmt("p", null, "#", keyword));
      container.appendChild(elmt);
    });
    this.elmt.appendChild(container);
    this.elmt.appendChild(container.cloneNode(true));
  }

}
class GalleryBox {
  constructor(elmts) {
    this.elmts = elmts;
    this.isShown = false;
    this.eventTriggerList = [];
    this.Init();
  }

  Init() {
    if (!Engine.isMobileScreen()) {
      this.eventTriggerList.push(new Engine.Observer.Intersection(this.elmts, obj => this.HandleIntersect(obj)));
    } else {
      for (const elmt of this.elmts) {
        this.eventTriggerList.push(new GalleryBox_Switcher(elmt));
      }

      console.log(this.eventTriggerList);
    }
  }

  Destroy() {
    Engine.Console.Log("Destroy main call");

    for (const event of this.eventTriggerList) {
      if (event.Destroy) event.Destroy();
    }
  }

  async AnimGallery(target) {
    const boxes = Engine.QAll(".gallery-box", target);

    for (const box of boxes) {
      box.classList.add("show");
      await Engine.WaitFor(300);
    }

    this.isShown = true;
  }

  HandleIntersect({
    isPrevious,
    target,
    entry
  }) {
    if (!this.isShown && entry.intersectionRatio != 0) return this.AnimGallery(target);
  }

}

class GalleryBox_Switcher {
  constructor(elmt) {
    this.elmt = elmt;
    this.childs = Engine.QAll(".gallery-box", elmt);
    this.isDestroyed = false;
    this.boxHeight = 0;
    this.currentSlide = 0;
    this.totalSlide = this.childs.length;
    this.switcherBtt = [];
    this.buttonsCtn = Engine.Elmt("div", {
      class: "switcher"
    });

    for (let i = 0; i < this.totalSlide; i++) {
      const btt = Engine.Elmt("div", {
        class: "switcher-btt"
      });
      btt.addEventListener('click', () => this.ShowSlide(i));
      this.switcherBtt.push(btt);
      this.buttonsCtn.appendChild(btt);
      const nextImg = Engine.Q('.arrow-next-img', this.childs[i]);
      const prevImg = Engine.Q('.arrow-prev-img', this.childs[i]);
      if (nextImg) nextImg.addEventListener('click', () => this.ShowSlide(i + 1));
      if (prevImg) prevImg.addEventListener('click', () => this.ShowSlide(i - 1));
      this.childs[i].classList.add('show');
      const height = Engine.DOM.getRect(this.childs[i]).height;
      if (height > this.boxHeight) this.boxHeight = height + 40;
      this.childs[i].classList.remove('show');
    }

    this.boxHeight = this.boxHeight < 320 ? 320 : this.boxHeight;
    this.elmt.style.height = this.boxHeight + 'px';
    this.SwipeHandle = new Engine.SwipeHandle(elmt, direction => this.OnSwipe(direction), diff => this.OnSwipeMove(diff));
    this.elmt.style.overflow = "hidden";
    Engine.DOM.insertAfter(this.buttonsCtn, this.elmt);
    this.ShowSlide(0);
  }

  Destroy() {
    console.log(this.elmt);
    const switcher = Engine.Q('.switcher', this.elmt.parentNode);
    if (switcher) Engine.DOM.removeElmt(switcher);
    this.elmt.style = "";
    this.isDestroyed = true;
    this.SwipeHandle.Destroy();

    for (const child of this.childs) {
      child.classList.add('show');
    }

    Engine.Console.Log("Destroy Switcher");
  }

  get currentBox() {
    return this.childs[this.currentSlide];
  }

  OnSwipe(direction) {
    if (direction) this.ShowSlide(this.currentSlide - direction);
  }

  OnSwipeMove(diff) {}

  ShowSlide(slideNumber) {
    if (slideNumber >= this.totalSlide) slideNumber = this.totalSlide - 1;
    if (slideNumber < 0) slideNumber = 0;

    for (const i in Array.from(this.childs)) {
      if (i == slideNumber) {
        this.childs[i].classList.add("show");
        this.switcherBtt[i].classList.add("on");
      } else {
        this.childs[i].classList.remove("show");
        this.switcherBtt[i].classList.remove("on");
      }
    }

    this.currentSlide = slideNumber;
  }

}
const Init = {};

Init.GalleryContainerShowOnScroll = () => {
  let mobile = Engine.isMobileScreen();
  const box = new GalleryBox(Engine.QAll('.gallery-container'));
  window.addEventListener('resize', () => {
    const isMobile = Engine.isMobileScreen();

    if (mobile != isMobile) {
      if (!isMobile) box.Destroy();
      box.Init();
      mobile = isMobile;
    }
  });
};

Init.CreateHashtagsBandeau = () => {
  new Bandeau().Render();
};
Engine.OnReady(() => {
  if (Engine.CheckCompatibility() === false || !Engine.JSEnable) return;
  const _E = Engine;
  const _Log = _E.Console.Log;

  for (let initFunc in Init) {
    try {
      Init[initFunc]();
    } catch (err) {
      console.error(err);
    }
  }

  _Log("Ready");
});
