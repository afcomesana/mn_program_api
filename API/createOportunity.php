<?php
// Datos del cliente
$nombreCli = ($_POST["name"]) ? $_POST["name"] : "Undefined";
$apellidosCli = ($_POST["lastname"]) ? $_POST["lastname"] : "Undefined";
$nombreCli = $nombreCli . ' ' . $apellidosCli;
$nifCli = ($_POST["nif"]) ? $_POST["nif"] : "";
$telfCli = ($_POST["phone"]) ? $_POST["phone"] : "";
$mailCli = ($_POST["email"]) ? $_POST["email"] : "";
$poblacionCli = ($_POST["localidad"]) ? $_POST["localidad"] : "Undefined";
$codPostalCli = ($_POST["codigo_postal"]) ? $_POST["codigo_postal"] : "Undefined";
$provinciaCli = ($_POST["provincia"]) ? $_POST["provincia"] : "Undefined";
$nivelEstudios = ($_POST["titulacion"]) ? $_POST["titulacion"] : "Undefined";
$situacionLaboral = ($_POST["profesion"]) ? $_POST["profesion"] : "Undefined";
$formacion = ($_POST["formacion"]) ? $_POST["formacion"] : "Undefined";
$pais = ($_POST["pais"]) ? $_POST["pais"] : "Undefined";
$area = ($_POST["area"]) ? $_POST["area"] : "Undefined";
$centro = ($_POST["centro"]) ? $_POST["centro"] : "Undefined";
$comentario = ($_POST["comments"]) ? $_POST["comments"] : "";

$datosCliente = array(
    "nombreCli" => $nombreCli,
    "nifCli" => $nifCli,
    "telfCli" => $telfCli,
    "mailCli" => $mailCli,
    "poblacionCli" => $poblacionCli,
    "codPostalCli" => $codPostalCli,
    "provinciaCli" => $provinciaCli,
    "nivelEstudios" => $nivelEstudios,
    "situacionLaboral" => $situacionLaboral
);
$datosCliente = json_encode($datosCliente);
// Otros datos del XML
$domicilio = ($_POST["domicilio"]) ? $_POST["domicilio"] : "Undefined";
$descripcionOportunidad = $_POST['submit_type'];
$notasOportunidad = "Area de interes: $area\nFormacion de interes: $formacion\nTitulacion: $nivelEstudios\nPais: $pais \nCentro mas cercano: $centro \nDomicilio de usuario: $domicilio \nComentario en la solicitud: $comentario";
$operador = "Supervisor";
$token = "***************";
$numCurso = ($_POST["id_curso"]) ? $_POST["id_curso"] : "Not found";
$anhoCurso = date("Y");
$numEmpresa = 2;
$instancia = "****_";
// URL de la API de mn program
$url = "https://client-url/API/ClientesService.asmx?op=CrearOportunidad";

// SOAP a la api de mn program
$xmlSoap = "<?xml version='1.0' encoding='utf-8'?>
            <soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>
            <soap:Body>
                <CrearOportunidad xmlns='http://tempuri.org/'>
                <instancia>$instancia</instancia>
                <numEmpresa>$numEmpresa</numEmpresa>
                <operador>$operador</operador>
                <passMD5></passMD5>
                <datosCliente>$datosCliente</datosCliente>
                <notasOportunidad>$notasOportunidad</notasOportunidad>
                <descripcionOportunidad>$descripcionOportunidad</descripcionOportunidad>
                <fuenteOportunidad>WEB</fuenteOportunidad>
                <numCurso></numCurso>
                <anhoCurso>$anhoCurso</anhoCurso>
                <token>$token</token>
                </CrearOportunidad>
            </soap:Body>
            </soap:Envelope>";

// Enviar XML
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: text/xml"));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $xmlSoap);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($curl);

if(curl_errno($curl)){
    throw new Exception(curl_error($curl));
}

curl_close($curl);
echo $result;
