var genero;
var imagen;
$(document).ready(function() {


    // onsubmit form
    

});


function actualizar(){
  // show alert loading
  if (!$('#termCondCheck').is(':checked')){
    obtenerAlertSwal(`Para continuar por favor acepte lo términos y condiciones.`, 'Advertencia', 'info')
    return;
  }
  getLoading("Actualizando la información...");

  // submit data

  var dia = $('#fecha_nacimiento_dia').val();
  var mes = $('#fecha_nacimiento_mes').val();
  var anio = $('#fecha_nacimiento_anio').val();
  var fecha_nac = dia + mes + anio;
if (fecha_nac !== '' && (dia == '' || mes == '' || anio == '')) {
  fecha_nac = '';
  obtenerAlertSwal(`Llene correctamente la fecha de nacimiento.\n`, 'Advertencia', 'info')
  return;
}

// put data (create user)
const formData = new FormData();
const xhr = new XMLHttpRequest();

formData.append('licenciatura',$('#licenciatura').val() );
if (genero) {
formData.append('genero',genero );
}
formData.append('fechaNacimientoDia',dia );
formData.append('fechaNacimientoMes',mes );
formData.append('fechaNacimientoAnio',anio );
formData.append('progreso',$('#progreso').val() );
formData.append('descripcion',$('#descripcion').val() );
formData.append('foto',imagen );

xhr.onreadystatechange = () => {

if (xhr.readyState === 4) {
if (xhr.status === 201 || xhr.status === 200) {
  obtenerAlertSwal('Se actualizó con éxito la cuenta.')
 .then(() => window.location.href = '/perfil')
} else {
  obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
}
}

};
xhr.open('PUT', '/usuario/actualizar', true);

xhr.send(formData);

};
