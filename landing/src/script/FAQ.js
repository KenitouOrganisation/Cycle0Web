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
const FAQListData = [{
  question: "Comment réserver des matériaux ?",
  answer: `Pour réserver des matériaux gratuits dans l’application, il vous suffit de vous rendre dans le menu « recherche », « à proximité » ou encore par catégorie. À partir de là, vous pourrez pré réserver les matériaux de votre choix en cliquant sur reverser.

Pour connaître les nouveaux arrivages, il est pour l’instant nécessaire de consulter régulièrement l’application. A terme, un système de notification et d’alerte sera actionnable afin que vous soyez alerté de l’arrivée de nouveautés à proximité de chez vous.
`
}, {
  question: "Peut-on déposer ou vendre des matériaux en étant un particulier ?",
  answer: `Nous recevons énormément de demandes dans ce sens, mais malheureusement, il n’est pas possible en tant que particulier de déposer des matériaux sur l’application. Les matériaux disponibles sur l’application sont uniquement issus de chantiers professionnels.
`
}, {
  question: "Comment récupérer des matériaux ?",
  answer: `Une fois votre réservation validée sur l’application, vous recevrez par mail les informations relatives au chantier (lieu, contact, etc.). Il ne vous reste plus qu’à vous rendre sur site pour le/les récupérer.
`
}, {
  question: "Comment télécharger l’application ?",
  answer: `Vous pouvez cliquer sur les liens situés en bas à gauche de cette page. Sinon, vous pouvez également vous rendre sur la Play store et l'App store pour télécharger l’application.
`
}, {
  question: "A quoi sert la géolocalisation ?",
  answer: `Le système de géolocalisation vous permet de visualiser sur l’application les matériaux situés pochent de chez vous. Le rayon varie selon l’endroit selon votre emplacement et la densité de population.

Si vous êtes situés dans une grande ville, votre rayon sera de 50 km. En revanche, si vous habitez dans un village votre rayon, sera élargi à 100km.

Ainsi, nous favorisons <b>les déplacements courts</b>, afin de limiter l’impact carbone des déplacements, tout en permettant d’offrir à tous un éventail suffisant pour trouver matériaux à son pied.
`
}, {
  question: "Pourquoi n’ai-je aucun matériau proche de chez moi ?",
  answer: `C’est une question de temps ! Nôtre démarche est née en Île-de-France il y a seulement 8 mois et nous redoublons nos efforts pour nous développer le plus rapidement possible dans tout l’hexagone. Nous travaillons actuellement notre arrivée dans la région Nord, Bretagne et en PACA.
`
}, {
  question: "Nous n’avons pas répondu à votre question ?",
  answer: `Posez-nous vos questions depuis <a href="./contacts.html?from_faq">notre formulaire ici</a>.
Nous vous répondrons le plus rapidement possible.
`
}];
class FAQListArticle {
  constructor(data, container) {
    this.data = data;
    this.container = container;
  }

  renderItem(item) {
    item.answer = item.answer.replace(/\n/g, "<br>");
    const box = Engine.Elmt("div", {
      class: "article-box"
    }, Engine.Elmt("div", {
      class: "header"
    }, Engine.Elmt("h2", null, item.question), Engine.Elmt("div", {
      class: "arrow"
    })), Engine.Elmt("p", {
      class: "answer"
    }, item.answer));
    box.addEventListener("click", () => {
      box.classList.toggle("on");
    });
    return box;
  }

  renderList() {
    const ctn = Engine.Elmt("div", {
      class: "article-list"
    }, this.data.map(this.renderItem));
    this.container.appendChild(ctn);
  }

}
Engine.OnReady(() => {
  document.querySelector("#faq-main").innerHTML = "<div class='content'></div>";
  const articles = new FAQListArticle(FAQListData, document.querySelector("#faq-main .content"));
  globalThis.articles = articles;
  articles.renderList();
  console.clear();
});
