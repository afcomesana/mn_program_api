/**
 * modulo para la gestion de los checkbox incluidos en el formulario
 * de Elementor
 */

import CheckOrigin from './CheckOrigin.js';

class CheckboxHandler {
    constructor() {
        this.checkOrigin = new CheckOrigin();
        this.formIdPrefix = this.checkOrigin.isInscription ? 'ins' : 'sdi';
        this.consentCheckbox = document.querySelector(`#form-field-${this.formIdPrefix}_acceptance`);
        this.consent = this.consentCheckbox ? this.consentCheckbox.checked : false;
        this.areaCheckbox = [];
        this.centroCheckbox = [];
        this.formCheckbox = {};
        this.requestLabel = false;
        this.areaFields = [
            {
                id: `form-field-${this.formIdPrefix}_area-0`,
                label: 'Educación'
            },
            {
                id: `form-field-${this.formIdPrefix}_area-1`,
                label:'Salud'
            },
            {
                id: `form-field-${this.formIdPrefix}_area-2`,
                label:'Social'
            },
            {
                id: `form-field-${this.formIdPrefix}_area-3`,
                label:'Otros'
            }
        ];
        this.centroFields = [
            {
                id: `form-field-${this.formIdPrefix}_centro-0`,
                label: 'Madrid'
            },
            {
                id: `form-field-${this.formIdPrefix}_centro-1`,
                label: 'Burgos'
            },
            {
                id: `form-field-${this.formIdPrefix}_centro-2`,
                label: 'Palma de Mallorca'
            },
            {
                id: `form-field-${this.formIdPrefix}_centro-3`,
                label: 'Ibiza'
            },
            {
                id: `form-field-${this.formIdPrefix}_centro-4`,
                label: 'Canarias'
            },
            {
                id: `form-field-${this.formIdPrefix}_centro-5`,
                label: 'Bilbao'
            },
            {
                id: `form-field-${this.formIdPrefix}_centro-6`,
                label: 'Chile'
            },
            {
                id: `form-field-${this.formIdPrefix}_centro-7`,
                label: 'Otros'
            }
        ];
        this.setCheckbox(this.areaFields, this.areaCheckbox);
        this.setCheckbox(this.centroFields, this.centroCheckbox);
        if (this.consentCheckbox) {
            this.consentCheckbox.addEventListener('click', () => {
                this.consent = this.consentCheckbox.checked;
            });
        }
    }
    setCheckbox = (fields, checkbox) => {
        fields.forEach(field => {
            checkbox.push({
                label: field.label,
                checkbox: document.querySelector('#' + field.id)
            });
        });
    }

    getCheckedAreas = () => {
        let checkedAreas = [];
        this.areaCheckbox.forEach(field => {
            field.checkbox.checked ? checkedAreas.push(field.label) : false;
        });
        return checkedAreas.join(' - ');
    }

    getCheckedCentros = () => {
        let checkedCentros = [];
        this.centroCheckbox.forEach(field => {
            field.checkbox.checked ? checkedCentros.push(field.label) : false;
        });
        return checkedCentros.join(' - ');
    }
}

export default CheckboxHandler;