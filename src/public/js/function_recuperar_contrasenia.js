$(document).ready(function() {

    // onsubmit login form
    $("#form-recuperar-contrasenia").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Enviando el correo para recuperar su contraseña...", "Sending.." );

        // submit data
        $.post("/correo/recuperarContrasenia", { email: $('#inputEmail').val() }, function() {})
            .done(function(res) {
                obtenerToast(5000).fire({
                        animation: true,
                        title: `El correo de recuperación ha sido enviado con éxito al correo ${res.data}!!`
                    })
                    .then(() => location.href = "/")
            })
            .fail(function(errResp) {
                obtenerToast(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
            });
    });

});