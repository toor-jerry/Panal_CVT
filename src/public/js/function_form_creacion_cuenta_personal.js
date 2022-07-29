$(document).ready(function() {


    // onsubmit form
    $("#form-cuenta-personal").submit(function(event) {

        event.preventDefault();
            // show alert loading
            getLoading("Creando cuenta...");

            // submit data
            $.post("/usuario", { 
                                nombre: $('#inputNombre').val(),
                                apellidos: $('#inputApellidos').val(),
                                email: $('#inputEmail').val(),
                                password: $('#inputPassword').val(),
                                contacto: $('#inputContacto').val(),
                                role: 'USER_PERSONAL'
                            }, function() {})
                .done(function(res) {
                    obtenerToast().fire({
                            animation: true,
                            title: `La cuenta ${res.data.email} ha sido creada con éxito!!`
                        })
                        .then(() => window.location.href = "/registro/personalizacion_de_perfil")
                })
                .fail(function(errResp) {
                    showAlert(errResp); // show error alert
                });
});
});