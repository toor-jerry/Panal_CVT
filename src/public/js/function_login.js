$(document).ready(function() {

    // onsubmit login form
    $("#form-usuario").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Verificando su identidad...", "Loading.." );

        // submit data
        $.post("/usuario/login", getDataUserLogin(), function() {})
            .done(function(res) {

                var toastLogin = Swal.mixin({ // create toast
                    toast: true,
                    icon: 'success',
                    title: 'General Title',
                    animation: false,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true
                });

                toastLogin.fire({
                        animation: true,
                        title: `Bienvenid@ ${res.data.nombre}!!`
                    })
                    .then(() => location.href = "/perfil")
            })
            .fail(function(errResp) {
                showAlert(errResp); // show error alert
            });
    });

});