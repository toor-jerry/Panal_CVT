$(document).ready(function() {


    // onsubmit form
    $("#form-cuenta-personal").submit(function(event) {

        event.preventDefault();
        verifcarNivelSeguridadPassword();
            // show alert loading
            getLoading("Creando cuenta...");

            // submit data
            $.post("/usuario", { 
                                nombre: $('#inputNombre').val(),
                                apellidos: $('#inputApellidos').val(),
                                email: $('#inputEmail').val(),
                                password: $('#inputPassword').val(),
                                contacto: $('#inputContacto').val(),
                                role: 'USER_ENTERPRISE'
                            }, function() {})
                .done(function(res) {
                    obtenerToast().fire({
                            animation: true,
                            title: `La cuenta ${res.data.email} ha sido creada con éxito!!`
                        })
                        .then(() => window.location.href = "/perfil/empresarial/1")
                })
                .fail(function(errResp) {
                    showAlert(errResp); // show error alert
                });
});
});