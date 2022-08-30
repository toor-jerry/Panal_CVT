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
                var ruta = '/';
                if (res.data.userRole == 'USER_PERSONAL') {
                    ruta = "/perfil"
                } else if(res.data.userRole == 'USER_ENTERPRISE'){
                    ruta = "/perfil/empresarial/1"
                } else if(res.data.userRole == 'USER_ADMIN'){
                    ruta = "/perfil/administrativo/1/1"
                } else if(res.data.userRole == 'SUPER_USER'){
                    ruta = "/perfil/sistemas"
                }
                obtenerToast(`Bienvenid@ ${res.data.nombre}!!`, ruta)
            })
            .fail(function(errResp) {
                obtenerAlertSwal(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
            });
    });

});