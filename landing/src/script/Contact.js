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
Engine.extendsVar_banMailList = '';

const FetchBanMailList = async () => {
  if (Engine.extendsVar_banMailList != '') {
    return Engine.extendsVar_banMailList;
  }

  const resp = await Engine.Ajax.FetchText('https://disposable-emails.github.io/list.txt', {
    method: 'GET'
  });
  console.clear();

  if (resp?.req?.status == 200 && resp?.req?.text) {
    const text = resp.text;
    const lines = text.replace(/\r/ig, '').split('\n');
    lines.push('crtsec.com');
    const domainsStr = lines.join('|');
    Engine.extendsVar_banMailList = domainsStr;
    return domainsStr;
  } else {
    console.log(resp);
    return '';
  }
};

FetchBanMailList();

const ContactCheckMail = async iptMail => {
  const domainsStr = await FetchBanMailList();
  const regex = new RegExp(`@(${domainsStr})$`);
  const iptMailValue = iptMail.value;
  const isMailValid = !regex.test(iptMailValue);

  if (!isMailValid) {
    iptMail.setCustomValidity('Veuillez utiliser une adresse mail valide');
    iptMail.reportValidity();
    return false;
  } else {
    iptMail.setCustomValidity('');
    return true;
  }
};
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const totalCarac = 300;
const totalObjectCarac = 80;
const totalMailCarac = 320;
const requestDate = new Date();
const ContactForms = {};
const CF = ContactForms;
CF.currentCarac = 0;
CF.reqUrl = "./contacts";
CF.formSubmitAtLeastOnce = false;

CF.Init = () => {
  CF._elmt = Engine.Q("#contact_forms");
  CF.InitElmt();
  CF.InitAplpyArgs();
  CF.Debounce = new Engine.DebounceCall(1000);
  CF._elmt = Engine.Q("#contact_forms");

  CF._elmt.addEventListener("submit", CF.OnSubmit);

  if (/colab_pro/.test(document.location.search)) CF.selectObject.value = "collab";
  CF.FormsShow();
};

CF.InitAplpyArgs = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const subject = params.get('subject');
  CF.selectObject.value = subject ? subject : "none";
};

CF.InitElmt = () => {
  CF.submitBtt = Engine.Elmt("input", {
    type: "submit",
    class: "_btt _orange center-form",
    value: "Envoyer"
  });
  CF.inputEmail = Engine.Elmt("input", {
    class: "entryInput",
    type: "email",
    name: "email",
    placeholder: "",
    required: true,
    maxLength: totalMailCarac.toString()
  });
  CF.selectObjectValues = [{
    value: "none",
    title: "Sélectionner un sujet ..."
  }, {
    value: "general",
    title: "Questions générales"
  }, {
    value: "info_product_services",
    title: "Informations sur les produits/services"
  }, {
    value: "support_tech",
    title: "Support technique"
  }, {
    value: "bug_error",
    title: "Signalement de bugs ou d'erreurs"
  }, {
    value: "suggestion",
    title: "Suggestions d'amélioration"
  }, {
    value: "collab",
    title: "Collaborer avec Cycle Zéro"
  }, {
    value: "press",
    title: "Demandes de presse ou médias"
  }, {
    value: "other",
    title: "Autres"
  }];
  CF.selectObject = Engine.Elmt("select", {
    name: "subject",
    class: "entryInput",
    required: true
  }, CF.selectObjectValues.map((opt, idx) => Engine.Elmt("option", {
    value: opt.value
  }, opt.title)));
  CF.inputObject = Engine.Elmt("input", {
    class: "entryInput",
    type: "text",
    name: "object",
    placeholder: "",
    autocomplete: "off",
    maxLength: totalObjectCarac.toString()
  });
  CF.textarea = Engine.Elmt("textarea", {
    class: "entryInput",
    name: "message",
    id: "",
    cols: "30",
    rows: "5",
    placeholder: "",
    required: true,
    autocomplete: "off",
    maxLength: totalCarac.toString()
  });
  CF.textareaCounterBox = Engine.Elmt("p", {
    class: "not-form textarea-counter center-form"
  }, Engine.Elmt("span", {
    class: "carac"
  }, CF.currentCarac.toString()), "/", Engine.Elmt("span", {
    class: "totalCarac"
  }, totalCarac.toString()));
  CF.textareaCounter = Engine.Q(".carac", CF.textareaCounterBox);
  CF.textarea.addEventListener("keyup", () => {
    const len = CF.textarea.value.length;
    if (len > totalCarac) return CF.textarea.value = CF.textarea.value.slice(0, totalCarac);
    CF.currentCarac = len;
    CF.textareaCounter.innerText = len.toString();
    const redDegress = `rgb(${255 * CF.currentCarac / totalCarac}, 0, 0)`;
    CF.textareaCounterBox.style.color = redDegress;
  });
  CF.textarea.addEventListener("keyup", () => {
    CF.formSubmitAtLeastOnce === true && CF.CheckForm.Message();
  });
  CF.inputEmail.addEventListener("keyup", () => {
    CF.formSubmitAtLeastOnce === true && CF.CheckForm.Email();
  });
  CF.inputObject.addEventListener("keyup", () => {
    CF.formSubmitAtLeastOnce === true && CF.CheckForm.Object();
  });
  CF.selectObject.addEventListener("change", () => {
    CF.formSubmitAtLeastOnce === true && CF.CheckForm.Subject();
  });
};

CF.FormsInputsLabelRender = (ipt, label, parentProps = {}) => {
  return Engine.Elmt("div", _extends({
    class: "ipt-ctn center-form"
  }, parentProps), ipt, Engine.Elmt("label", {
    for: ipt.name,
    class: "form-label"
  }, label));
};

CF.FormsRender = () => Engine.Elmt("div", {
  class: "not-form-elmt"
}, Engine.Elmt("h2", {
  class: "h2 center-form"
}, "Formulaire de contact"), Engine.Elmt("p", {
  class: "center-form"
}, "Pour faciliter votre exp\xE9rience, n'oubliez pas de consulter ", Engine.Elmt("a", {
  href: "./contacts.html.from_contact"
}, "notre FAQ"), ".", Engine.Elmt("br", null), "Elle regorge d'informations utiles qui pourraient r\xE9pondre \xE0 vos interrogations.", Engine.Elmt("br", null), Engine.Elmt("br", null), "Nous vous invitons \xE0 y jeter un coup d'\u0153il avant de nous contacter. Nous serons ravis de vous aider si vous ne trouvez pas la r\xE9ponse que vous recherchez.", Engine.Elmt("br", null), Engine.Elmt("br", null), "Merci pour votre compr\xE9hension !"), Engine.Elmt("br", null), CF.FormsInputsLabelRender(CF.inputEmail, "Votre adresse email"), CF.FormsInputsLabelRender(CF.selectObject, "Sujet"), CF.FormsInputsLabelRender(CF.inputObject, "Précisez le sujet"), CF.FormsInputsLabelRender(CF.textarea, "Votre message", {
  style: "margin-bottom: 0;"
}), CF.textareaCounterBox, Engine.Elmt("div", {
  class: "h-captcha center-form",
  "data-sitekey": "2626626e-f325-458f-bc72-2d6457624cc4"
}), Engine.Elmt("div", {
  id: "captcha-error-text"
}), Engine.Elmt("script", {
  src: "https://js.hcaptcha.com/1/api.js",
  async: true,
  defer: true
}), CF.submitBtt);

CF.FormsShow = () => {
  CF._elmt?.replaceChildren(CF.FormsRender());
};

CF.CheckForm = {
  ParseCodeData: data => {
    data.message = data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    data.object = data.object.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    data.subject = data.subject.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    data.email = data.email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return data;
  },
  Email: (data = null) => {
    let correct = true;
    data = data ? data : {
      email: CF.inputEmail.value
    };
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;

    if (!emailRegex.test(data.email)) {
      CF.inputEmail.setCustomValidity("Veuillez utiliser une adresse mail valide");
      CF.inputEmail.reportValidity();
      correct = false;
    } else {
      correct = ContactCheckMail(CF.inputEmail);
    }

    if (data.email.length > totalMailCarac) {
      CF.inputEmail.setCustomValidity(`L'adresse mail ne doit pas dépasser ${totalMailCarac} caractères`);
      CF.inputEmail.reportValidity();
      correct = false;
    }

    if (data.email.length > totalMailCarac) {
      CF.inputEmail.setCustomValidity(`L'adresse mail ne doit pas dépasser ${totalMailCarac} caractères`);
      CF.inputEmail.reportValidity();
      correct = false;
    }

    if (data.email.length < 10) {
      CF.inputEmail.setCustomValidity(`L'adresse mail doit contenir au moins 10 caractères`);
      CF.inputEmail.reportValidity();
      correct = false;
    }

    if (correct) CF.inputEmail.setCustomValidity("");
    return correct;
  },
  Object: (data = null) => {
    let correct = true;
    data = data ? data : {
      object: CF.inputObject.value
    };

    if (data.object.length > totalObjectCarac) {
      CF.inputObject.setCustomValidity(`L'objet ne doit pas dépasser ${totalObjectCarac} caractères`);
      CF.inputObject.reportValidity();
      correct = false;
    }

    if (correct) CF.inputObject.setCustomValidity("");
    return correct;
  },
  Subject: (data = null) => {
    data = data ? data : {
      subject: CF.selectObject.value
    };
    let correct = true;
    if (data.subject === "none" || data.subject === "") correct = false;

    if (CF.selectObjectValues.filter(opt => opt.value === data.subject).length < 1) {
      correct = false;
    }

    if (!correct) {
      CF.selectObject.setCustomValidity("Veuillez choisir un sujet");
      CF.selectObject.reportValidity();
    } else {
      CF.selectObject.setCustomValidity("");
    }

    return correct;
  },
  Message: (data = null) => {
    let correct = true;
    data = data ? data : {
      message: CF.textarea.value
    };

    if (data.message.length > totalCarac) {
      CF.textarea.setCustomValidity(`Le message ne doit pas dépasser ${totalCarac} caractères`);
      CF.textarea.reportValidity();
      correct = false;
    }

    if (data.message.length < 10) {
      CF.textarea.setCustomValidity(`Le message doit contenir au moins 10 caractères`);
      CF.textarea.reportValidity();
      correct = false;
    }

    if (correct) CF.textarea.setCustomValidity("");
    return correct;
  },
  Captcha: () => {
    const captchaErrorText = Engine.Q('#captcha-error-text');
    captchaErrorText.innerHTML = "";

    try {
      const token = grecaptcha.getResponse();

      if (token) {
        console.log("CAPTCHA verification passed");

        while (captchaErrorText.firstChild) {
          captchaErrorText.removeChild(captchaErrorText.firstChild);
        }

        return true;
      }

      console.log("CAPTCHA verification failed");
      captchaErrorText.appendChild(Engine.Elmt("p", {
        class: "center-form",
        style: "color: red; font-size: 17px; margin-top: 0;"
      }, "Veuillez valider le captcha"));
      return false;
    } catch (err) {
      console.error(err);
      captchaErrorText.appendChild(Engine.Elmt("p", {
        style: "color: 'red;"
      }, "Une erreur s'est produite lors de la validation du captcha."));
    }

    return false;
  },
  All: data => {
    const checkEmail = CF.CheckForm.Email(data);
    const checkObject = CF.CheckForm.Object(data);
    const checkSubject = CF.CheckForm.Subject(data);
    const checkMessage = CF.CheckForm.Message(data);
    const checkCaptcha = CF.CheckForm.Captcha();
    return checkEmail && checkObject && checkSubject && checkMessage && checkCaptcha;
  }
};

CF.OnSubmit = e => CF.Debounce.InvokeAsync(async () => {
  e.preventDefault();
  await CF.OnSubmitDebounceCall(e);
});

CF.OnSubmitDebounceCall = async e => {
  CF.submitBtt.disabled = true;
  CF.formSubmitAtLeastOnce = true;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const form = e.target;
  const data = new FormData(form);
  const dataObj = CF.CheckForm.ParseCodeData(Object.fromEntries(data));
  const checkForm = CF.CheckForm.All(dataObj);

  if (!dataObj || !checkForm) {
    CF.submitBtt.disabled = false;
    return;
  }

  const subjectOption = CF.selectObjectValues.find(opt => opt.value === dataObj['subject']);
  const subjectTitle = subjectOption ? subjectOption.title : dataObj['subject'];
  dataObj['message'] += `


--------------------
Email : ${dataObj['email']}
Sujet ID : ${dataObj['subject']}
Sujet : [${subjectTitle}] ${dataObj['object']}
Date d'envoi : ${new Date().toLocaleString()}
Requête : ${window.location.href}
Date de la requête : ${requestDate.toLocaleString()}
-------------------

`;
  dataObj['message'] = dataObj['message'].replace(/\n/g, "<br />");
  dataObj['object'] = `[${dataObj['subject']}] ${dataObj['object']}`;
  delete dataObj['subject'];
  console.log(dataObj);
  const resp = await Engine.Ajax.FetchJSON(CF.reqUrl, {
    method: "POST",
    body: JSON.stringify(dataObj),
    headers: headers
  });

  if (!resp.req || resp.req?.status == 404) {
    CF.submitBtt.disabled = false;
    return Engine.Alert.Error({
      title: "Erreur serveur",
      message: "Le serveur est inaccessible pour le moment, veuillez réessayer dans quelques instants ..."
    });
  }

  if (resp.req?.status == 200) {
    CF._elmt.replaceChildren(Engine.Elmt("div", {
      class: "center-form"
    }, Engine.Elmt("h2", {
      class: "h2"
    }, "Formulaire de contact"), Engine.Elmt("p", {
      class: "not-form"
    }, "Votre message a bien \xE9t\xE9 envoy\xE9, nous allons le traiter dans les plus brefs d\xE9lais.", Engine.Elmt("br", null), "Toute l'\xE9quipe vous remercie de votre int\xE9r\xEAt pour Cycle Z\xE9ro \uD83D\uDE0C.", Engine.Elmt("br", null), Engine.Elmt("br", null), "A tr\xE8s bient\xF4t !"), Engine.Elmt("div", {
      class: "not-form special-end-btn"
    }, Engine.Elmt("a", {
      href: "/",
      class: "_btt _orange"
    }, "Retour \xE0 l'accueil"))));

    return;
  }

  Engine.Alert.Error({
    title: `Erreur ${resp.req?.status}`,
    message: `Une erreur ${resp.req?.status} est survenue.`
  });
  CF.submitBtt.disabled = false;
};
Engine.OnReady(() => {
  ContactForms.Init();
  console.clear();
});
