/**
 * modulo para la identificacion de la pagina del cliente desde la que se
 * realiza la solicitud de informacion
 */

class CheckOrigin {
    constructor() {
        this.barUrl = window.location.href.split("/");
        this.location;
        this.isFormacion = this.checkFormacionPage();
        this.isCentro = this.checkCentrosPage();
        this.isBeca = this.checkBecasPage();
        this.isContacto = this.checkContactoPage();
        this.isInscription = this.checkInscripcionPage();
        this.centro = false;
        this.formacion = false;
        this.getLocation();
    }
    // funcion para localizar la pagina en la que se encuentra el usuario
    getLocation = () => {
        switch (true) {
            case this.isFormacion:
                this.location = 'formacion';
                break;
            case this.isCentro:
                this.location = 'centro';
                break;
            case this.isBeca:
                this.location = 'beca';
                break;
            case this.isContacto:
                this.location = 'contacto';
                break;
            default:
                this.location = 'unknown';
                break;
        }
    }
    checkFormacionPage = () => {
        this.barUrl.forEach((element, index) => {
            if (element == "formacion" && index < (this.barUrl.length - 2)) {
                this.isFormacion = true;
            }
        });
        return this.isFormacion;
    }

    checkCentrosPage = () => {
        this.barUrl.forEach(element => {
            if (element == "centros") {
                this.isCentro = true;
            }
        });
        return this.isCentro;
    }
    
    checkBecasPage = () => {
        this.barUrl.forEach(element => {
            if (element == "becas") {
                this.isBeca = true;
            }
        });
        return this.isBeca;
    }
    
    checkContactoPage = () => {
        this.barUrl.forEach(element => {
            if (element == "contacto") {
                this.isContacto = true;
            }
        });
        return this.isContacto;
    }

    checkInscripcionPage = () => {
        this.barUrl.forEach(element => {
            if (element == 'formaliza-tu-inscripcion') {
                this.isInscription = true;
            }
        });
        return this.isInscription;
    }

    // adaptar formulario de solicitud a la pagina en la que se encuentra
    // el usuario
    handleDataLocation = () => {
        console.log('executing handleLocation...');
        switch (this.location) {
            case 'formacion':
                if (this.barUrl.length > 5) {
                    this.formacion = this.getSubsectionName('formacion');
                }
                break;
            case 'centro':
                this.centro = this.getSubsectionName('centros');
                break;
        }
    }

    handleDOMLocation = () => {
        switch (this.location) {
            case 'formacion':
                if (this.barUrl.length > 5) {
                    document.querySelector('#form-field-sdi_formacion').parentNode.remove();
                }
                break;
            case 'centro':
                document.querySelector('.elementor-field-group-sdi_centro').remove();
                break;
        }
    }

    getSubsectionName = (section) => {
        return this.barUrl.slice(this.barUrl.indexOf(section)+1).join('-').replaceAll('-', ' ');
    }
}

export default CheckOrigin;