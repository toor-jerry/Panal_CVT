$(document).ready(function() {


    // onsubmit form
    $("#form-cuenta-personal").submit(function(event) {

        event.preventDefault();
            // show alert loading
                if (PasswordStrength.test('', $('#inputPasswordPersonal').val()).score <= 35) {
                  return obtenerAlertSwal(`Por favor mejore la seguridad de su contraseña!!`, 'Datos inválidos!!', 'warning')
              }

            getLoading("Creando cuenta...");

            // submit data
            $.post("/usuario", { 
                                nombre: $('#inputNombre').val(),
                                apellidos: $('#inputApellidos').val(),
                                email: $('#inputEmail').val(),
                                password: $('#inputPasswordPersonal').val(),
                                numeroContacto: $('#inputContacto').val(),
                                role: 'USER_PERSONAL'
                            }, function() {})
                .done(function(res) {
                    obtenerToast(`La cuenta ${res.data.email} ha sido creada con éxito!!`,"/registro/personalizacion_de_perfil")
                })
                .fail(function(errResp) {
                    obtenerAlertSwal(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
                });
});
});