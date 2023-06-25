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
const presseListData_coupDeCoeur = [{
  title: "TF1 - Reportage",
  datetime: "2023-05-30",
  type: "VIDÉO",
  description: "Bricolage : cette appli peut vous permettre de faire de grosses économies",
  image: "./src/img/illustrations/tf1_cyclezero.jpg",
  link: "https://www.tf1info.fr/conso/video-reportage-tf1-bricolage-cette-appli-cycle-zero-peut-vous-permettre-de-faire-de-grosses-economies-2258775.html"
}, {
  title: "France 2 - Reportage",
  datetime: "2023-05-29",
  type: "VIDÉO",
  description: "Une idée pour la France : Des matériaux gratuits dans les chantiers",
  image: "./src/img/illustrations/fr2_cyclezero.jpg",
  link: "https://www.france.tv/france-2/journal-13h00/4911703-edition-du-lundi-29-mai-2023.html"
}, {
  title: "France 3 - Reportage",
  datetime: "2023-05-22",
  type: "VIDÉO",
  description: "Une nouvelle application pour récupérer gratuitement des matériaux sur les chantiers",
  image: "./src/img/illustrations/fr3_cyclezero.jpg",
  link: "https://france3-regions.francetvinfo.fr/paris-ile-de-france/paris/video-une-nouvelle-application-pour-recuperer-gratuitement-des-materiaux-sur-les-chantiers-2778070.html"
}];
const presseListData_autres = [{
  title: "WE DEMAIN",
  datetime: "2023-03-27",
  type: "ARTICLE",
  description: "Cycle Zéro : une appli pour récupérer gratuitement des matériaux de chantiers",
  image: "",
  link: "https://www.wedemain.fr/inventer/cycle-zero-une-appli-pour-recuperer-gratuitement-des-materiaux-de-chantiers/"
}, {
  title: "Marcelle",
  datetime: "2023-02-28",
  type: "ARTICLE",
  description: "Une appli pour récupérer (gratuitement) les déchets des chantiers",
  image: "",
  link: "https://marcelle.media/une-appli-pour-recuperer-gratuitement-les-dechets-des-chantiers-cycle-zero/"
}, {
  title: "Green is the New Black",
  datetime: "2023-02-21",
  type: "ARTICLE",
  description: "Cycle Zero Co-Founder Selim Zouaoui on Turning Construction Waste Into Resource",
  image: "",
  link: "https://greenisthenewblack.com/cycle-zero-co-founder-selim-zouaoui-on-turning-construction-waste-into-resource/"
}, {
  title: "EKOPO",
  datetime: "2023-04-14",
  type: "ARTICLE",
  description: "Cycle Zéro : une appli pour récupérer des matériaux de chantiers",
  image: "",
  link: "https://www.ekopo.fr/Thematique/entreprises-1285/Breves/Cycle-Zero-un-appli-pour-recuperer-des-materiaux-de-chantiers-379010.htm"
}, {
  title: "Le nouvel Economiste",
  datetime: "2023-02-06",
  type: "ARTICLE",
  description: "Cycle Zéro, une application pour le réemploi des déchets parisiens du BTP",
  image: "",
  link: "https://www.lenouveleconomiste.fr/cyclezero-une-application-pour-le-reemploi-des-dechets-parisiens-du-btp-97890/"
}, {
  title: "France Bleu",
  datetime: "2023-02-09",
  type: "PODCAST",
  description: "Cycle Zero, l'appli malin pour recycler les matériaux de chantiers franciliens",
  image: "",
  link: "https://www.francebleu.fr/emissions/c-est-quoi-c-chantier/cycle-zero-l-appli-malin-pour-recycler-les-materiaux-de-chantiers-franciliens-1681300"
}, {
  title: "Transition(s)",
  datetime: "2023-04-21",
  type: "PODCAST",
  description: "Karima Lebsir : cette architecte fait la chasse au gaspillage sur les chantiers",
  image: "",
  link: "https://podcasts.apple.com/fr/podcast/transition-s/id1481435719?i=1000610085296"
}, {
  title: "Le Figaro",
  datetime: "2023-04-20",
  type: "VIDÉO",
  description: "Cycle Zéro : l'appli pour recycler les matériaux de chantiers",
  image: "",
  link: "https://video.lefigaro.fr/figaro/video/cycle-zero-lappli-pour-recycler-les-materiaux-de-chantiers/"
}, {
  title: "Le Moniteur",
  datetime: "2023-04-04",
  type: "ARTICLE",
  description: "Réemploi sur les chantiers : Cycle Zéro s'adresse aux particuliers bricoleurs",
  image: "",
  link: "https://www.lemoniteur.fr/article/reemploi-sur-les-chantiers-cycle-zero-s-adresse-aux-particuliers-bricoleurs.2263671"
}, {
  title: "18h39 - Castorama",
  datetime: "2022-10-02",
  type: "ARTICLE",
  description: "L'application Cycle Zéro permet de récupérer gratuitement des matériaux et des déchets de chantier",
  image: "",
  link: "https://www.18h39.fr/articles/cycle-zero-application-recuperer-gratuitement-materiaux-chantier.html"
}, {
  title: "NordLittoral",
  datetime: "2023-05-22",
  type: "ARTICLE",
  description: "Cette application permet de récupérer gratuitement des matériaux sur les chantiers",
  image: "",
  link: "https://www.nordlittoral.fr/174637/article/2023-05-22/cette-application-permet-de-recuperer-gratuitement-des-materiaux-sur-les"
}, {
  title: "EchantillonsClub",
  datetime: "2023-06-01",
  type: "ARTICLE",
  description: "Cycle Zéro : L’appli pour trouver des matériaux gratuits sur les chantiers",
  image: "",
  link: "https://www.echantillonsclub.com/194646-cycle-zero.html"
}, {
  title: "Cd-mentiel Magazine",
  datetime: "2023-06-11",
  type: "ARTICLE",
  description: "Cycle Zéro : l’appli qui révolutionne le secteur du bâtiment",
  image: "",
  link: "https://www.cd-mentielmagazine.fr/cycle-zero-lappli-qui-revolutionne-le-secteur-du-batiment/"
}, {
  title: "20 minutes",
  datetime: "2023-06-14",
  type: "ARTICLE",
  description: "« On n’imagine pas le gâchis »… Sur les chantiers, des initiatives se lancent pour donner une seconde vie aux déchets",
  image: "",
  link: "https://www.20minutes.fr/planete/4040460-20230614-imagine-gachis-chantiers-initiatives-lancent-donner-seconde-vie-dechets"
}, {
  title: "AirZen Radio",
  datetime: "2023-06-16",
  type: "PODCAST+ARTICLE",
  description: "Cycle Zéro, une application du réemploi des matériaux de chantier",
  image: "",
  link: "https://www.airzen.fr/cycle-zero-une-application-du-reemploi-des-materiaux-de-chantier/"
}];
class PresseListArticle {
  constructor(data, container) {
    this.data = data;
    this.container = container;
  }

  sortByDate(desc = false) {
    this.data.sort((a, b) => {
      const datetimeA = new Date(a.datetime);
      const datetimeB = new Date(b.datetime);
      if (desc) return datetimeB - datetimeA;
      return datetimeA - datetimeB;
    });
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

  renderItem(item) {
    return Engine.Elmt("div", {
      class: "article-box"
    }, Engine.Elmt("a", {
      target: "_blank",
      href: item.link
    }, Engine.Elmt("h2", null, item.title), Engine.Elmt("p", {
      class: "datetime"
    }, this.convertToFrenchDate(item.datetime)), Engine.Elmt("p", null, item.type, Engine.Elmt("span", {
      class: "_dot"
    }, ". "), item.description), item.image && Engine.Elmt("img", {
      src: item.image,
      alt: item.title
    }), Engine.Elmt("p", {
      class: "authors"
    }, item.authors), Engine.Elmt("p", {
      class: "seemore"
    }, "Voir plus", Engine.Elmt("span", null, "\u2192"))));
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
  Engine.Console.Log('Ready Presse');
  const listCoupDeCoeur = new PresseListArticle(presseListData_coupDeCoeur, Engine.Q('#coup-de-coeur .content'));
  listCoupDeCoeur.render();
  const listAutres = new PresseListArticle(presseListData_autres, Engine.Q('#autres-articles .content'));
  listAutres.sortByDate(true);
  listAutres.render();
});
