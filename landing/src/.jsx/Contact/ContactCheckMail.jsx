Engine.extendsVar_banMailList = '';
const FetchBanMailList = async () => {

    if(Engine.extendsVar_banMailList != ''){
        return Engine.extendsVar_banMailList;
    }

    const resp = await Engine.Ajax.FetchText('https://disposable-emails.github.io/list.txt', { method : 'GET' })
    console.clear();

    if(resp?.req?.status == 200 && resp?.req?.text){
        const text = resp.text;
        const lines = text.replace(/\r/ig, '').split('\n');

        lines.push('crtsec.com')

        const domainsStr = lines.join('|');

        Engine.extendsVar_banMailList = domainsStr;
        return domainsStr;
    }else{
        console.log(resp)
        return '';
    }
};
FetchBanMailList(); // preload

const ContactCheckMail = async (iptMail) => {

    const domainsStr = await FetchBanMailList();
    const regex = new RegExp(`@(${domainsStr})$`);

    const iptMailValue = iptMail.value;
    const isMailValid = !regex.test(iptMailValue);

    if(!isMailValid){
        iptMail.setCustomValidity('Veuillez utiliser une adresse mail valide');
        iptMail.reportValidity();
        return false;
    }else{
        iptMail.setCustomValidity('');
        return true;
    }

};