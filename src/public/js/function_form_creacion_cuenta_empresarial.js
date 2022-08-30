var imagen;

$(document).ready(function () {


  // onsubmit form
  $("#form-cuenta-empresarial").submit(function (event) {

    event.preventDefault();
      if (PasswordStrength.test('', $('#inputPasswordEmpresarial').val()).score <= 35) {
        return obtenerAlertSwal(`Por favor mejore la seguridad de su contraseña!!`, 'Datos inválidos!!', 'warning')
      }
    // show alert loading
    getLoading("Loading..", "Por favor espere.");
    // submit data
    const formData = new FormData();
    const xhr = new XMLHttpRequest();
    formData.append('nombre', $('#inputNombre').val());
    formData.append('rfc', $('#inputRFC').val());
    formData.append('email', $('#inputCorreo').val());
    formData.append('password', $('#inputPasswordEmpresarial').val());
    formData.append('direccion', $('#inputDireccion').val());
    formData.append('numeroContacto', $('#inputNumeroContacto').val());
    formData.append('descripcion', $('#inputDescripcion').val());
    formData.append('role', 'USER_ENTERPRISE');


    if (imagen) {
      formData.append('foto', imagen);
    }

    xhr.onreadystatechange = () => {

      if (xhr.readyState === 4) {
        if (xhr.status === 201 || xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          obtenerToast(`La cuenta ${response.data.email} ha sido creada con éxito!!`, "/perfil/empresarial/1")
        } else {
          obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
        }
      }

    };
    xhr.open('POST', '/usuario', true);

    xhr.send(formData);

  });
});