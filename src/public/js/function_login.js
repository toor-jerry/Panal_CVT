$(document).ready(function() {

    // onsubmit login form
    $("#form-usuario").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Verificando su identidad...");

        // submit data
        $.post("/usuario/login", {
            email: $('#inputEmail').val(), password: $('#inputPassword').val()
        }, function() {})
            .done(function(res) {

                obtenerToast().fire({
                        animation: true,
                        title: `Bienvenid@ ${res.data.nombre}!!`
                    })
                    .then(() => {
                        if (res.data.userRole == 'USER_PERSONAL') {
                            location.href = "/perfil"
                        } else if(res.data.userRole == 'USER_ENTERPRISE'){
                            location.href = "/perfil/empresarial/1"
                        } else if(res.data.userRole == 'USER_ADMIN'){
                            location.href = "/perfil/administrativo/1/1"
                        }
                    })
            })
            .fail(function(errResp) {
                showAlert(errResp); // show error alert
            });
    });

});