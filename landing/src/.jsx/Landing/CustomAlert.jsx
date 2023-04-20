function _CSS_ToString(css){
    let str = "";
    for (let key in css) {
        // convert zIndex to z-index and so on
        const keyFormatted = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        str += `${keyFormatted}: ${css[key]};`;
    }
    return str;
}

function CustomAlertOnReady() {
//     // création du fond noir semi-transparent
//     const backdropStyle = {
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         zIndex: 11111,
//     };

//     // création du style de la popup
//     const modalStyle = {
//         position: "fixed",
//         top: "50%",
//         left: "50%",
//         transform: "translate(-50%, -50%)",
//         backgroundColor: "white",
//         padding: "20px",
//         borderRadius: "5px",
//         zIndex: 11112,
//         padding: "25px 36px",
//         overflow: "auto",
//         maxHeight: "70%",
//         maxWidth: "700px",
//         width: "70%"
//     };

//     // création du style du bouton de fermeture
//     const closeButtonStyle = {
//         position: "absolute",
//         top: "15px",
//         right: "15px",
//         cursor: "pointer",
//         fontSize: "20px",
//         fontWeight: "bold",
//     };

//     const closeButtonImgStyle = {
//         width: "20px",
//         height: "20px",
//     };


//     const modal = document.createElement("div");

//     // création de la popup
//     const message = `
// Chers membres du mouvement Cycle Zéro, nous tenons à vous informer que suite à un problème technique rencontré par notre hébergeur certains comptes ont été supprimés. Nous sommes désolés pour ce désagrément et nous vous conseillons de vérifier que votre compte est toujours actif. Dans le cas contraire, nous vous invitons à en recréer un. 

// Nous restons disponibles et à votre écoute. 

// La team Cycle Zéro

//     `;
//     const popup = (
//         <div>
//             <div style={_CSS_ToString(backdropStyle)}></div>
//             <div style={_CSS_ToString(modalStyle)}>
//                 <div>{message.replace(/\n/g, "<br>")}</div>
//                 <div
//                     style={_CSS_ToString(closeButtonStyle)}
//                     data-js-attr={{
//                         onclick: () => {
//                             document.body.removeChild(modal)
//                         }
//                     }}
//                 >
//                     <img src="./src/img/icons/close.png" style={_CSS_ToString(closeButtonImgStyle)} />
//                 </div>
//             </div>
//         </div>
//     );

//     // affichage de la popup dans le body
//     modal.appendChild(popup);
//     document.body.appendChild(modal);
}
