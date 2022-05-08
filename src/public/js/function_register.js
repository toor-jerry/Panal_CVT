$(document).ready(function() {

    /***************************
     * Listen Areas
     ***************************/
    // New area
    socket.on('new-area-registered', function(res) {
        var area = res.data; // cite created by a user
        addArea(area, 'inputArea');
    });
    // Delete area
    socket.on('delete-area-registered', function(res) {

        var area = res.data; // cite created by a user
        // Remove field table 
        $(`#${area._id}-option-area`).remove();

    });


    // onsubmit signup form
    $("#form-register").submit(function(event) {

        event.preventDefault();

        // area required
        if ($('#inputArea').val() === '0') {
            return showDataInvalidArea();
        }

        if (PasswordStrength.test('', $('#inputPassword').val()).score <= 35) {
            return swal.fire(
                'Datos inválidos!!',
                'Por favor mejore la seguridad de su contraseña!!',
                'warning'
            );
        }

        // passwords equals
        if ($('#inputPassword').val() !== $('#inputRepeatPassword').val()) {
            return swal.fire(
                'Datos inválidos!!',
                'Las contraseñas deben coincidir.',
                'warning'
            );
        }

        // show alert loading
        getLoading("Loading..", "Por favor espere.");

        // post data (create user)
        $.post("/user", getDataUser(), function() {})
            .done(function() {

                swal.fire({
                    title: 'Registro exitoso!',
                    text: 'Se ha registrado con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true
                }).then(() => location.href = "/user/all");
            })
            .fail(function(errResp) {
                showError(errResp); // show error alert
            });
    });

});