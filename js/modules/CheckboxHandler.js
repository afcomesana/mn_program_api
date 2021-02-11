/**
 * modulo para la gestion de los checkbox incluidos en el formulario
 * de Elementor
 */

import CheckOrigin from './CheckOrigin.js';

class CheckboxHandler {
    constructor() {
        this.consentCheckbox = document.querySelector('#form-field-sdi_acceptance');
        this.consent = this.consentCheckbox ? this.consentCheckbox.checked : false;
        this.areaCheckbox = [];
        this.centroCheckbox = [];
        this.formCheckbox = {};
        this.requestLabel = false;
        this.areaFields = [
            {
                id: 'form-field-sdi_area-0',
                label: 'Educación'
            },
            {
                id: 'form-field-sdi_area-1',
                label:'Salud'
            },
            {
                id: 'form-field-sdi_area-2',
                label:'Social'
            },
            {
                id: 'form-field-sdi_area-3',
                label:'Otros'
            }
        ];
        this.centroFields = [
            {
                id: 'form-field-sdi_centro-0',
                label: 'Madrid'
            },
            {
                id: 'form-field-sdi_centro-1',
                label: 'Burgos'
            },
            {
                id: 'form-field-sdi_centro-2',
                label: 'Palma de Mallorca'
            },
            {
                id: 'form-field-sdi_centro-3',
                label: 'Ibiza'
            },
            {
                id: 'form-field-sdi_centro-4',
                label: 'Canarias'
            },
            {
                id: 'form-field-sdi_centro-5',
                label: 'Bilbao'
            },
            {
                id: 'form-field-sdi_centro-6',
                label: 'Chile'
            },
            {
                id: 'form-field-sdi_centro-7',
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