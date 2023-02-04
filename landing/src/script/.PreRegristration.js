document.addEventListener('DOMContentLoaded', async ()=>{

    const FormatCount = (val)=>{
        return val.toLocaleString({minimumFractionDigits : 0});
    };

    const rep = await fetch('/pre-registration/count');
    const val = await rep.text();

    document
        .querySelector("[data-elmt='preinscription']")
        .innerHTML = FormatCount( parseInt(val) );

});