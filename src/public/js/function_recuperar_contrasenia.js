$(document).ready(function() {

    // onsubmit login form
    $("#form-recuperar-contrasenia").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Enviando el correo para recuperar su contraseña...", "Sending.." );

        // submit data
        $.post("/correo/recuperarContrasenia", { email: $('#inputEmail').val() }, function() {})
            .done(function(res) {
                obtenerToast(`El correo de recuperación ha sido enviado con éxito al correo ${res.data}!!`, "/", 5000)
            })
            .fail(function(errResp) {
                obtenerAlertSwal(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
            });
    });

});