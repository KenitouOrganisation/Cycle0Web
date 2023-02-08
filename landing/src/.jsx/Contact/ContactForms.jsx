const totalCarac = 300;
const totalObjectCarac = 100;
const totalMailCarac = 320;

const ContactForms = {};
const CF = ContactForms;

// should be readonly, never use it as a thrustable value
CF.currentCarac = 0;
CF.reqUrl = "./contacts";
CF.Init = () => {

    CF._elmt = Engine.Q("#contact_forms");

    // TODO : remove this
    CF.TemporaryForms();
    return;

    CF.InitElmt();
    CF.Debounce = new Engine.DebounceCall(1000);

    CF._elmt = Engine.Q("#contact_forms");
    CF._elmt.addEventListener("submit", CF.OnSubmit);

    if(/join_equip/.test(document.location.search))
        CF.inputObject.value = "Objet : Rejoindre l'équipe";

    CF.FormsShow();
};

CF.TemporaryForms = () => {

    CF._elmt.replaceChildren((
        <div class="not-form" style="text-align: justify; min-height: 60vh;">
            <div>
                <h2 class="h2">Nous contacter</h2>
                <p style="margin-top: 50px;">
                    Pour nous contacter, vous pouvez nous envoyer un mail à l'adresse suivante : <a href="mailto:contact@cyclezero.fr">contact@cyclezero.fr</a>.
                </p>
                <p>
                    Vous pouvez également nous retrouver sur les réseaux sociaux pour être tenu au courant de nos dernières actualités sur <a target="_blank" href="https://www.instagram.com/cyclezero.app/">Instagram</a>, <a target="_blank" href="https://www.linkedin.com/company/cycle-zero/">LinkedIn</a> et <a target="_blank" href="https://www.linkedin.com/company/cycle-zero/">Facebook</a>.
                </p>
                <br />
                <p>
                    Toute l'équipe vous remercie de votre intérêt pour Cycle Zéro 😌.
                </p>
                <br />
                <p style="
                    border-top: 1px solid #dfdfdf;
                    padding-top: 30px;
                ">
                    Vous pouvez dès à présent télécharger notre application sur vos stores préférés ! 🎉
                </p>
            </div>
        </div>
    ))

};

CF.InitElmt = () => {
    CF.submitBtt = <input type="submit" class="_btt _orange" value="Envoyer" />;
    CF.inputEmail = (
        <input
            type="email"
            name="email"
            placeholder="Votre adresse email"
            required
            maxLength={totalMailCarac.toString()}
        />
    );
    CF.inputObject = (
        <input
            type="text"
            name="object"
            placeholder="Objet"
            required
            autocomplete="off"
            maxLength={totalObjectCarac.toString()}
        />
    );
    CF.textarea = (
        <textarea
            name="message"
            id=""
            cols="30"
            rows="5"
            placeholder="Votre message"
            required
            autocomplete="off"
            maxLength={totalCarac.toString()}
        ></textarea>
    );

    CF.textareaCounterBox = (
        <p class="not-form textarea-counter">
            <span class="carac">{CF.currentCarac.toString()}</span>/
            <span class="totalCarac">{totalCarac.toString()}</span>
        </p>
    );

    CF.textareaCounter = Engine.Q(".carac", CF.textareaCounterBox);

    CF.textarea.addEventListener("keyup", () => {
        const len = CF.textarea.value.length;

        if (len > totalCarac)
            return (CF.textarea.value = CF.textarea.value.slice(0, totalCarac));

        CF.currentCarac = len;
        CF.textareaCounter.innerText = len.toString();

        const redDegress = `rgb(${(255 * CF.currentCarac) / totalCarac}, 0, 0)`;
        CF.textareaCounterBox.style.color = redDegress;

    });

    CF.textarea.addEventListener("keyup", () => {
        CF.CheckForm.Message();
    });

    CF.inputEmail.addEventListener("keyup", () => {
        CF.CheckForm.Email();
    });

    CF.inputObject.addEventListener("keyup", () => {
        CF.CheckForm.Object();
    });
};

CF.FormsRender = () => (
    <div class="not-form-elmt">
        <h2 class="h2">Formulaire de contact</h2>
        {CF.inputEmail}
        {CF.inputObject}
        {CF.textarea}
        {CF.textareaCounterBox}
        {CF.submitBtt}
    </div>
);

CF.FormsShow = () => {
    CF._elmt?.replaceChildren(CF.FormsRender());
};

CF.CheckForm = {
    ParseCodeData : (data) => {
        // parse HTML tags
        data.message = data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        data.object = data.object.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        data.email = data.email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return data;
    },
    Email : (data=null) => {

        let correct = true;

        data = data
            ? data
            : {email : CF.inputEmail.value};

        // check email
        const emailRegex = /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
        if (!emailRegex.test(data.email)) {
            CF.inputEmail.setCustomValidity("Veuillez utiliser une adresse mail valide");
            CF.inputEmail.reportValidity();
            correct = false;
        }else{
            correct = ContactCheckMail(CF.inputEmail);
        }

        // check email length
        if (data.email.length > totalMailCarac) {
            CF.inputEmail.setCustomValidity(
                `L'adresse mail ne doit pas dépasser ${totalMailCarac} caractères`
            );
            CF.inputEmail.reportValidity();
            correct = false;
        }

        // check email max length
        if (data.email.length > totalMailCarac) {
            CF.inputEmail.setCustomValidity(
                `L'adresse mail ne doit pas dépasser ${totalMailCarac} caractères`
            );
            CF.inputEmail.reportValidity();
            correct = false;
        }

        // check email minimum length of 10
        if (data.email.length < 10) {
            CF.inputEmail.setCustomValidity(
                `L'adresse mail doit contenir au moins 10 caractères`
            );
            CF.inputEmail.reportValidity();
            correct = false;
        }

        if(correct)
            CF.inputEmail.setCustomValidity("");

        return correct;
    },
    Object : (data=null) => {

        let correct = true;

        data = data
            ? data
            : {object : CF.inputObject.value};

        // check object
        if (data.object.length > totalObjectCarac) {
            CF.inputObject.setCustomValidity(
                `L'objet ne doit pas dépasser ${totalObjectCarac} caractères`
            );
            CF.inputObject.reportValidity();
            correct = false;
        }
        
        // check object minimum length of 10
        if (data.object.length < 10) {
            CF.inputObject.setCustomValidity(
                `L'objet doit contenir au moins 10 caractères`
            );
            CF.inputObject.reportValidity();
            correct = false;
        }

        if(correct)
            CF.inputObject.setCustomValidity("");

        return correct;
    },
    Message : (data=null) => {

        let correct = true;

        data = data
            ? data
            : {message : CF.textarea.value};

        // check message
        if (data.message.length > totalCarac) {
            CF.textarea.setCustomValidity(
                `Le message ne doit pas dépasser ${totalCarac} caractères`
            );
            CF.textarea.reportValidity();
            correct = false;
        }

        // check message minimum length of 10
        if (data.message.length < 10) {
            CF.textarea.setCustomValidity(
                `Le message doit contenir au moins 10 caractères`
            );
            CF.textarea.reportValidity();
            correct = false;
        }

        if(correct)
            CF.textarea.setCustomValidity("");

        return correct;
    },

    All : (data) => {
        const checkEmail = CF.CheckForm.Email(data);
        const checkObject = CF.CheckForm.Object(data);
        const checkMessage = CF.CheckForm.Message(data);

        return checkEmail && checkObject && checkMessage;
    }

};


CF.OnSubmit = (e) =>
    CF.Debounce.InvokeAsync(async () => {
        e.preventDefault();
        await CF.OnSubmitDebounceCall(e);
    });

CF.OnSubmitDebounceCall = async (e) => {
    CF.submitBtt.disabled = true;

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

    console.log(dataObj)

    // send data to server
    const resp = await Engine.Ajax.FetchJSON(CF.reqUrl, {
        method: "POST",
        body: JSON.stringify(dataObj),
        headers: headers,
    });

    const req = resp.req;

    console.log(resp);


    if (!req || req?.status != 404) {
        CF.submitBtt.disabled = false;

        return Engine.Alert.Error({
            title: "Erreur serveur",
            message:
                "Le serveur est inaccessible pour le moment, veuillez réessayer dans quelques instants ...",
        });
    }

    if (req?.status == 200) {
        // replace form with success message
        CF._elmt.replaceChildren(
            <div class="not-form-elmt">
                <h2 class="h2">Formulaire de contact</h2>
                <p class="not-form">
                    Votre message a bien été envoyé, nous allons le traiter dans les plus brefs délais.
                </p>
                <div class="not-form" style="margin-top: 60px;">
                    <a href="/" class="_btt _orange">
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        );
    }

    Engine.Alert.Error({
        title: `Erreur ${req.status}`,
        message: `Une erreur ${req.status} est survenue.`
    });

    CF.submitBtt.disabled = false;

};
