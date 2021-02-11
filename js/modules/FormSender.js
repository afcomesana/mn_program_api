import CheckboxHandler from './CheckboxHandler.js';
import CheckOrigin from './CheckOrigin.js';

class FormSender {
    constructor() {
        this.checkboxHandler = new CheckboxHandler();
        this.checkOrigin = new CheckOrigin();
        this.formIdPrefix = this.checkOrigin.isInscription ? 'ins' : 'sdi';
        this.checkOrigin.handleDataLocation();
        this.host_url = window.location.href.substring(0, window.location.href.indexOf(".com/") + 5);
        this.plugin_url = this.host_url + "wp-content/plugins/mn_program_psicopraxis/API/";
        this.phpSendFile = '../API/createOportunity.php'; // acordarse de cambiar esto
        this.userData = [
            {   
                label: "name",
                data: document.querySelector(`#form-field-${this.formIdPrefix}_name`).value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "lastname",
                data: document.querySelector(`#form-field-${this.formIdPrefix}_lastname`).value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "phone",
                data: document.querySelector(`#form-field-${this.formIdPrefix}_phone`).value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "email",
                data: document.querySelector(`#form-field-${this.formIdPrefix}_email`).value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
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
                data: document.querySelector(`#form-field-${this.formIdPrefix}_titulacion`).value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "formacion",
                data: this.checkOrigin.formacion ? this.checkOrigin.formacion : document.querySelector(`#form-field-${this.formIdPrefix}_formacion`).value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: true
            },
            {
                label: "comments",
                data: document.querySelector(`#form-field-${this.formIdPrefix}_comment`).value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                required: false
            }
        ];
        this.inscriptionFields = [
            {
                label: "nif",
                data: '#form-field-ins_dni',
                required: true
            },
            {
                label: "domicilio",
                data: '#form-field-ins_domicilio',
                required: true
            },
            {
                label: "localidad",
                data: '#form-field-ins_localidad',
                required: true
            },
            {
                label: "codigo_postal",
                data: '#form-field-ins_cod_postal',
                required: true
            },
            {
                label: "provincia",
                data: '#form-field-ins_provincia',
                required: false
            },
            {
                label: "pais",
                data: '#form-field-ins_pais',
                required: true
            },
            {
                label: "profesion",
                data: '#form-field-ins_profesion',
                required: true
            }
        ];
        this.userFormData = new FormData();
    }

    createFormData = () => {
        let success = true;
        if (this.checkOrigin.isInscription) this.addInscriptionFields();
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

    // campos de inscripcion
    addInscriptionFields = () => {
        this.inscriptionFields.forEach(field => {
            this.userData.push({
                label: field.label,
                data: field.data,
                required: field.required
            });
        });
    }

}

export default FormSender;