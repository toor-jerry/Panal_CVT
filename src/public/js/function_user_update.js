$(document).ready(function() {


    // onsubmit signup form
    $("#form-user-update").submit(function(event) {

        event.preventDefault();

        // area required
        if ($('#inputArea').val() === '0') {
            return showDataInvalidArea();
        }
        if ($('#inputPasswordUser').val() !== '') {
            if (PasswordStrength.test('', $('#inputPasswordUser').val()).score <= 35) {
                return swal.fire(
                    'Datos inválidos!!',
                    'Por favor mejore la seguridad de su contraseña!!',
                    'warning'
                );
            }
            // passwords equals
            if ($('#inputPasswordUser').val() !== $('#inputRepeatPasswordUSer').val()) {
                return swal.fire(
                    'Datos inválidos!!',
                    'Las contraseñas deben coincidir.',
                    'warning'
                );
            }
        }


        // show alert loading
        getLoading("Loading..", "Por favor espere.");

        var data = { name: $('#inputFirstName').val(), last_name: $('#inputLastName').val(), area: $('#inputArea').val(), role: $('#inputRole').val() };
        if ($('#inputPasswordUser').val() !== '') {
            data.password = $('#inputPasswordUser').val();
        }


        // put data (create user)
        $.ajax({
            url: "/user/edit/" + $('#edit-user-id').attr('name'),
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function() {
                swal.fire({
                    title: 'Actualización exitosa!',
                    text: 'Se actualizó con éxito la cuenta.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true
                }).then(() => location.reload())
            },
            error: function(errResp) {
                showError(errResp, true); // show error alert
            }
        });

    });

});