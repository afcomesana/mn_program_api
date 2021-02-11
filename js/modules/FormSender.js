import CheckboxHandler from './CheckboxHandler.js';
import CheckOrigin from './CheckOrigin.js';

class FormSender {
    constructor() {
        this.checkboxHandler = new CheckboxHandler();
        this.checkOrigin = new CheckOrigin();
        this.checkOrigin.handleDataLocation();
        this.host_url = window.location.href.substring(0, window.location.href.indexOf(".com/") + 5);
        this.plugin_url = host_url + "wp-content/plugins/mn_program_psicopraxis/API/";
        this.phpSendFile = '../../API/createOportunity.php';
        this.userData = [
            {   
                label: "name",
                data: document.querySelector('#form-field-sdi_name').value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "lastname",
                data: document.querySelector('#form-field-sdi_lastname').value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "phone",
                data: document.querySelector('#form-field-sdi_phone').value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "email",
                data: document.querySelector('#form-field-sdi_email').value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "area",
                data: this.checkboxHandler.getCheckedAreas(),
                required: true
            },
            {
                label: "centro",
                data: this.checkOrigin.centro ? this.checkOrigin.centro : this.checkboxHandler.getCheckedCentros(),
                required: true
            },
            {
                label: "titulacion",
                data: document.querySelector('#form-field-sdi_titulacion').value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "formacion",
                data: this.checkOrigin.formacion ? this.checkOrigin.formacion : document.querySelector('#form-field-sdi_formacion').value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "comment",
                data: document.querySelector('#form-field-sdi_comment').value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: false
            }
        ];
        this.userFormData = new FormData();
    }

    createFormData = () => {
        let success = true;
        this.userData.forEach(field => {
            if (field.required) {
                (field.data !== '') ? this.userFormData.append(field.label, field.data) : success = false;
            } else {
                this.userFormData.append(field.label, field.data);
            }
        });
        return success ? true : false;
    }

    sendUserData = () => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.phpSendFile, true);
        xhr.onload = function() {
            if (this.status === 200) {
                console.log(this.responseText);
            } else {
                console.log("Ha habido un error");
            }
        }
        xhr.send(this.userFormData);
    }
}

export default FormSender;