import CheckboxHandler from './modules/CheckboxHandler.js';
import CheckOrigin from './modules/CheckOrigin.js';
import FormSender from './modules/FormSender.js';

document.addEventListener('DOMContentLoaded', () => {
    // check if the user is at the inscription page
    let checkOrigin = new CheckOrigin();
    let checkboxHandler = new CheckboxHandler();
    
    checkOrigin.handleDOMLocation();
    document.querySelector('button[type="submit"]').addEventListener('click', e => {
        e.preventDefault();
        if (checkboxHandler.consent) {
            let formSender = new FormSender();
            formSender.createFormData() ? formSender.sendUserData() : alert('Faltan campos obligatorios por rellenar');
        } else {
            alert('Es necesario aceptar los términos de privacidad.');
        }
    });
});