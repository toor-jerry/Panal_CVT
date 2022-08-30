$(document).ready(function () {

  // onsubmit signup form
  $("#form-user-update").submit(function (event) {

    event.preventDefault();

    if ($('#inputPasswordUser').val() !== '') {
      if (PasswordStrength.test('', $('#inputPasswordUser').val()).score <= 35) {
        return obtenerAlertSwal(`Por favor mejore la seguridad de su contraseña!!`, 'Datos inválidos!!', 'warning')
      }
    }


    // show alert loading
    getLoading("Loading..", "Por favor espere.");

    // put data (create user)
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('nombre', $('#inputNombre').val());
    if ($('#inputApellidos').val() !== '' && $('#inputApellidos').val() !== undefined) {
    formData.append('apellidos', $('#inputApellidos').val());
    }
    if ($('#inputRole').val() !== '' && $('#inputRole').val() !== undefined) {
      formData.append('userRole', $('#inputRole').val());
    }
    formData.append('foto', imagen);

    if ($('#inputPasswordUser').val() !== '') {
      formData.append('password', $('#inputPasswordUser').val());
    }

    xhr.onreadystatechange = () => {

      if (xhr.readyState === 4) {
        if (xhr.status === 201 || xhr.status === 200) {
          obtenerAlertSwal('Se actualizó con éxito la cuenta.')
            .then(() => location.reload())
        } else {
          obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
        }
      }

    };
    xhr.open('PUT', "/usuario/actualizar?usuarioId=" + $('#edit-user-id').attr('name'), true);

    xhr.send(formData);

  });

});