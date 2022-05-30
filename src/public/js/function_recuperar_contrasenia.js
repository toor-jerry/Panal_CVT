$(document).ready(function() {

    // onsubmit login form
    $("#form-recuperar-contrasenia").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Enviando el correo para recuperar su contraseña...", "Sending.." );

        // submit data
        $.post("/correo", getDataEmail(), function() {})
            .done(function(res) {
                var toastLogin = Swal.mixin({ // create toast
                    toast: true,
                    icon: 'success',
                    title: 'General Title',
                    animation: false,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true
                });

                toastLogin.fire({
                        animation: true,
                        title: `El correo de recuperación ha sido enviado con éxito al correo ${res.data}!!`
                    })
                    .then(() => location.href = "/")
            })
            .fail(function(errResp) {
                showAlert(errResp); // show error alert
            });
    });

});