// llamada a API para obtener codigos de cursos
let cursosArray = [],
    parser = new DOMParser(),
    xml_response,
    programa,
    urlArray = window.location.href.split("."),
    host_url = window.location.href.substring(0, window.location.href.indexOf(".com/") + 5),
    plugin_url = host_url + "wp-content/plugins/mn_program_psicopraxis/API/",
    formType,
    dataConsent;

// getCursos();

function getCursos() {
    let xhr_cursos = new XMLHttpRequest();
    xhr_cursos.open("POST", plugin_url + "getCursos.php", true);
    xhr_cursos.onload = function() {
        if(this.status === 200) {
            console.log(this.responseText);
            xml_response = parser.parseFromString(this.responseText, "text/xml");
            handleXMLresponse();
            console.log(cursosArray);
        }
    }
    xhr_cursos.send();
}

function handleXMLresponse() {
    let expedientes = xml_response.getElementsByTagName('ExpedienteDTO');
    for (expediente of expedientes) {
        let descripcion = expediente.getElementsByTagName('descripcion')[0].innerHTML,
            codigo = expediente.getElementsByTagName('codigo')[0].innerHTML;
        
        let cursoApi = {
            nombreCurso: descripcion.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
            codigoCurso: codigo
        };
        cursosArray.push(cursoApi);
    }
}

function checkFormacionPage () {
    let barUrl = window.location.href.split("/");
    for (element of barUrl) {
        if (element == "formacion") {
            return true;
        }
    }
    return false;
}

function checkCentrosPage () {
    let barUrl = window.location.href.split("/");
    for (element of barUrl) {
        if (element == "centros") {
            return true;
        }
    }
    return false;
}

function checkBecasPage() {
    let barUrl = window.location.href.split("/");
    for (element of barUrl) {
        if (element == "becas") {
            return true;
        }
    }
    return false;
}

function checkContactoPage() {
    let barUrl = window.location.href.split("/");
    for (element of barUrl) {
        if (element == "contacto") {
            return true;
        }
    }
    return false;   
}

function clickOptionArea (option) {
    if (option.classList.contains("area_selected")) {
        option.classList.remove("area_selected");
    } else {
        option.classList.add("area_selected");
    }
}

function clickOptionCentro (option) {
    if (option.classList.contains("centro_selected")) {
        option.classList.remove("centro_selected");
    } else {
        option.classList.add("centro_selected");
    }
}

function getChechboxByLabelText(text) {
    let documentLabels = document.querySelectorAll("label"),
        requestLabel = false;
    documentLabels.forEach(label => {
        if (label.innerText == text) {
            requestLabel = label.parentNode.querySelectorAll("span input");
        }
    });

    return requestLabel;
}

function getElementByLabelText(text) {
    let documentLabels = document.querySelectorAll("label"),
        requestLabel = false;

    documentLabels.forEach(label => {
        if (label.innerText == text) {
            requestLabel = label;
        }
    });
    return requestLabel;
}

function checkDataConsent(input) {
    if (input.classList.contains("consent_accepted")) {
        input.classList.remove("consent_accepted");
    } else {
        input.classList.add("consent_accepted");
    }
}

function checkboxToString(checkbox) {
    let checkboxString = "";
    checkbox.forEach((item, index) => {
        if (index < (checkbox.length - 1)) {
            checkboxString += item.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + " - ";
        } else {
            checkboxString += item.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
    });
    return checkboxString;
}

function createSDI() {
    setTimeout(() => {
        let sdiFormButton = document.querySelector("button[type=submit]");
        dataConsent = getElementByLabelText("He leído la cláusula para el tratamiento de mis datos y doy mi consentimiento").parentNode.querySelector("input");
        dataConsent.addEventListener("click", event => {
            checkDataConsent(event.target);
        });

        let areaCheckbox = getChechboxByLabelText("ÁREA*");
        let centroInteresCheckbox = getChechboxByLabelText("¿QUÉ CENTRO TIENES MÁS CERCANO?");

        areaCheckbox.forEach(check => {
            check.addEventListener("click", event => {
                let option = event.target.parentNode;
                clickOptionArea(option);
            });
        });
        centroInteresCheckbox.forEach(check => {
            check.addEventListener("click", event => {
                let option = event.target.parentNode;
                clickOptionCentro(option);
            });
        });
        sdiFormButton.addEventListener("click", sendSDI);
    }, 500);
}

function sendSDI() {
    let nombre = document.querySelector("input[placeholder='Nombre']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        apellidos = document.querySelector("input[placeholder='Apellidos']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        email = document.querySelector("input[placeholder='Tu email']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        telefono = document.querySelector("input[placeholder='Tu teléfono']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        titulacion = document.querySelector("input[placeholder='Tu titulación']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        area = document.querySelectorAll(".area_selected"),
        areaString = checkboxToString(area),
        centroCercano = document.querySelectorAll(".centro_selected"),
        centroString = checkboxToString(centroCercano),
        formacion = window.location.href.split("/")[window.location.href.split("/").length - 2].split("-").join(" "),
        comentario = getElementByLabelText("INCLUYE TU COMENTARIO").parentNode.querySelector("textarea").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        formType = "SOLICITUD DE INFORMACION";

        nombre = nombre + " " + apellidos;
    if (nombre != "" && apellidos != "" && email != "" && telefono != "" && areaString != "" && titulacion != "") {
        if (dataConsent.classList.contains("consent_accepted")) {
            let data = new FormData();
                data.append("nombre", nombre);
                data.append("telefono", telefono);
                data.append("email", email);
                data.append("titulacion", titulacion);
                data.append("area", areaString);
                data.append("centro", centroString);
                data.append("formacion", formacion);
                data.append("comentario", comentario);
                data.append("formType", formType);

                let xhr = new XMLHttpRequest();
                xhr.open("POST", plugin_url + "crearOportunidad.php", true);
                xhr.onload = function() {
                    if (this.status === 200) {
                        console.log(this.responseText);
                    } else {
                        console.log("Ha habido un error");
                    }
                }
                xhr.send(data);
        } else {
            alert("Es necesario leer y aceptar la cláusula de tratamiento de datos.");
        }
        
    } else {
        alert("Faltan campos obligatorios por completar");
    }
}

function createInscripcion() {
    setTimeout(() => {
        let inscripcionFormButton = document.querySelector("button[type=submit]");
        dataConsent = getElementByLabelText("He leído la cláusula para el tratamiento de mis datos y doy mi consentimiento").parentNode.querySelector("input");
        dataConsent.addEventListener("click", event => {
            checkDataConsent(event.target);
        });

        let areaCheckbox = getChechboxByLabelText("ÁREA*");
        let centroInteresCheckbox = getChechboxByLabelText("¿EN QUÉ CENTRO TE INTERESA HACER EL CURSO?");

        areaCheckbox.forEach(check => {
            check.addEventListener("click", event => {
                let option = event.target.parentNode;
                clickOptionArea(option);
            });
        });
        centroInteresCheckbox.forEach(check => {
            check.addEventListener("click", event => {
                let option = event.target.parentNode;
                clickOptionCentro(option);
            });
        });
        inscripcionFormButton.addEventListener("click", sendInscripcion);
    }, 500);
}

function sendInscripcion() {
    let nombre = document.querySelector("input[placeholder='Nombre']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        apellidos = document.querySelector("input[placeholder='Apellidos']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        nif = document.querySelector("input[placeholder='Tu ID']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        email = document.querySelector("input[placeholder='Tu email']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        telefono = document.querySelector("input[placeholder='Tu teléfono']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        domicilio = document.querySelector("input[placeholder='Tu domicilio']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        localidad = document.querySelector("input[placeholder='Tu localidad']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        codigoPostal = document.querySelector("input[placeholder='Tu códio postal']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        provincia = document.querySelector("input[placeholder='Tu provincia']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        pais = document.querySelector("input[placeholder='Tu país']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        profesion = document.querySelector("input[placeholder='Tu profesión']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        titulacion = document.querySelector("input[placeholder='Tu titulación']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        area = document.querySelectorAll(".area_selected"),
        areaString = checkboxToString(area),
        centroCercano = document.querySelectorAll(".centro_selected"),
        centroString = checkboxToString(centroCercano),
        formacion = window.location.href.split("/")[window.location.href.split("/").length - 2].split("-").join(" "),
        comentario = getElementByLabelText("INCLUYE TU COMENTARIO").parentNode.querySelector("textarea").value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        formType = "INSCRIPCION";

        nombre = nombre + " " + apellidos;
    if (nombre != "" && apellidos != "" && nif != "" && domicilio != "" && localidad != "" && codigoPostal != "" && provincia != "" && pais != "" && profesion != "" && email != "" && telefono != "" && areaString != "" && titulacion != "") {
        if (dataConsent.classList.contains("consent_accepted")) {
            let data = new FormData();
                data.append("nombre", nombre);
                data.append("telefono", telefono);
                data.append("domicilio", domicilio);
                data.append("localidad", localidad);
                data.append("codigoPostal", codigoPostal);
                data.append("provincia", provincia);
                data.append("pais", pais);
                data.append("profesion", profesion);
                data.append("email", email);
                data.append("titulacion", titulacion);
                data.append("area", areaString);
                data.append("centro", centroString);
                data.append("formacion", formacion);
                data.append("comentario", comentario);
                data.append("formType", formType);

                let xhr = new XMLHttpRequest();
                xhr.open("POST", plugin_url + "crearOportunidad.php", true);
                xhr.onload = function() {
                    if (this.status === 200) {
                        console.log(this.responseText);
                    } else {
                        console.log("Ha habido un error");
                    }
                }
                xhr.send(data);
        } else {
            alert("Es necesario leer y aceptar la cláusula de tratamiento de datos.");
        }
    } else {
        alert("Faltan campos obligatorios por completar");
    }
}

function sendCentroSDI() {
    let nombre = document.querySelector("input[placeholder='Nombre']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        apellidos = document.querySelector("input[placeholder='Apellidos']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        email = document.querySelector("input[placeholder='Tu email']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        telefono = document.querySelector("input[placeholder='Tu teléfono']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        formacion = document.querySelector("select").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        centro = window.location.href.split("/")[window.location.href.split("/").length - 2],
        formType = "SOLICITUD DE INFORMACION";

    nombre = nombre + " " + apellidos;

    if (nombre != "" && apellidos != "" && email != "" && telefono != "") {
        if (dataConsent.classList.contains("consent_accepted")) {
            let data = new FormData();
            data.append("nombre", nombre);
            data.append("telefono", telefono);
            data.append("email", email);
            data.append("formacion", formacion);
            data.append("centro", centro);
            data.append("formType", formType);

            let xhr = new XMLHttpRequest();
            xhr.open("POST", plugin_url + "crearOportunidad.php", true);
            xhr.onload = function() {
                if (this.status === 200) {
                    console.log(this.responseText);
                } else {
                    console.log("Ha habido un error");
                }
            }
            xhr.send(data);
        } else {
            alert("Es necesario aceptar la política de privacidad.");
        }
    } else {
        alert("Faltan campos obligatorios por completar.");
    }
}

function centrosSDI() {
    let sdiFormButton = document.querySelector("button[type=submit]");
    dataConsent = getElementByLabelText("Acepto la Política de Privacidad").parentNode.querySelector("input");
    dataConsent.addEventListener("click", event => {
        checkDataConsent(event.target);
    });
    sdiFormButton.addEventListener("click", sendCentroSDI);
}

function sendBecasSDI() {
    let nombre = document.querySelector("input[placeholder='Nombre']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        apellidos = document.querySelector("input[placeholder='Apellidos']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        email = document.querySelector("input[placeholder='Tu email']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        telefono = document.querySelector("input[placeholder='Tu teléfono']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        titulacion = document.querySelector("input[placeholder='Tu titulación']").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        area = document.querySelectorAll(".area_selected"),
        areaString = checkboxToString(area),
        centroCercano = document.querySelectorAll(".centro_selected"),
        centroString = checkboxToString(centroCercano),
        formacion = document.querySelector("select").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        comentario = getElementByLabelText("INCLUYE TU COMENTARIO").parentNode.querySelector("textarea").value.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        formType = "SOLICITUD DE INFORMACION";

        nombre = nombre + " " + apellidos;

    if (nombre != "" && apellidos != "" && email != "" && telefono != "" && areaString != "" && titulacion != "") {
        if (dataConsent.classList.contains("consent_accepted")) {
            let data = new FormData();
            data.append("nombre", nombre);
            data.append("telefono", telefono);
            data.append("email", email);
            data.append("titulacion", titulacion);
            data.append("area", areaString);
            data.append("centro", centroString);
            data.append("formacion", formacion);
            data.append("comentario", comentario);
            data.append("formType", formType);

            let xhr = new XMLHttpRequest();
            xhr.open("POST", plugin_url + "crearOportunidad.php", true);
            xhr.onload = function() {
                if (this.status === 200) {
                    console.log(this.responseText);
                } else {
                    console.log("Ha habido un error");
                }
            }
            xhr.send(data);
        } else {
            alert("Es necesario leer y aceptar la cláusula de tratamiento de datos.");
        }
    } else {
        alert("Faltan campos obligatorios por completar");
    }
}

function becasSDI() {
    setTimeout(() => {
        let sdiFormButton = document.querySelector("button[type=submit]");
        dataConsent = getElementByLabelText("He leído la cláusula para el tratamiento de mis datos y doy mi consentimiento").parentNode.querySelector("input");
        dataConsent.addEventListener("click", event => {
            checkDataConsent(event.target);
        });

        let areaCheckbox = getChechboxByLabelText("ÁREA*");
        let centroInteresCheckbox = getChechboxByLabelText("¿QUÉ CENTRO TIENES MÁS CERCANO?");

        areaCheckbox.forEach(check => {
            check.addEventListener("click", event => {
                let option = event.target.parentNode;
                clickOptionArea(option);
            });
        });
        centroInteresCheckbox.forEach(check => {
            check.addEventListener("click", event => {
                let option = event.target.parentNode;
                clickOptionCentro(option);
            });
        });
        sdiFormButton.addEventListener("click", sendBecasSDI);
    }, 500);
}

function contactoSDI() {
    let sdiFormButton = document.querySelector("button[type=submit]");
    dataConsent = getElementByLabelText("He leído y acepto el tratamiento de mis datos personales").parentNode.querySelector("input");
    dataConsent.addEventListener("click", event => {
        checkDataConsent(event.target);
    });

    let areaCheckbox = getChechboxByLabelText("ÁREA*");
    let centroInteresCheckbox = getChechboxByLabelText("¿QUÉ CENTRO TIENES MÁS CERCANO?");

    areaCheckbox.forEach(check => {
        check.addEventListener("click", event => {
            let option = event.target.parentNode;
            clickOptionArea(option);
        });
    });
    centroInteresCheckbox.forEach(check => {
        check.addEventListener("click", event => {
            let option = event.target.parentNode;
            clickOptionCentro(option);
        });
    });
    sdiFormButton.addEventListener("click", sendSDI);
}

document.addEventListener("DOMContentLoaded", () =>  {
    // comprobar si estamos en alguna pagina de formacion
    if (checkFormacionPage()) {
        let infoButtons = document.querySelectorAll("a[role=button]"),
            sdiButton,
            inscripcionButton;
        for (button of infoButtons) {
            if (button.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() == "solicita informacion") {
                sdiButton = button;
            }
            else if (button.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() == "inscribete") {
                inscripcionButton = button;
            }
        }
        sdiButton.addEventListener("click", createSDI);
        inscripcionButton.addEventListener("click", createInscripcion);
    } else if (checkCentrosPage()) {
        centrosSDI();
    } else if (checkBecasPage()) {
        let sdiButton;
        document.querySelectorAll("a[role=button]").forEach(el => {
            if (el.innerText == "CONSULTA MÁS INFORMACIÓN") {
                sdiButton = el;
            }
        });
        sdiButton.addEventListener("click", becasSDI);
    } else if (checkContactoPage()) {
        contactoSDI();
    }
});