$(document).ready(function () {
    $("#inputRole").change(function () {
        if ($(this).val() == "USER_ENTERPRISE") {
            $("#inputApellidos").attr("placeholder", "Razón Social");
        } else {
            $("#inputApellidos").attr("placeholder", "Apellidos");
        }
    });
    // onsubmit signup form
    $("#form-register").submit(function (event) {

        event.preventDefault();
        if (PasswordStrength.test('', $('#inputPasswordUser').val()).score <= 35) {
            return obtenerAlertSwal(`Por favor mejore la seguridad de su contraseña!!`, 'Datos inválidos!!', 'warning')
        }
        // show alert loading
        getLoading("Loading..", "Por favor espere.");

        // put data (create user)
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('foto', imagen);
        formData.append('nombre', $('#inputNombre').val());
        if ($('#inputRole').val() == "USER_ENTERPRISE") {
            formData.append('razonSocial', $('#inputApellidos').val());
        } else {
            formData.append('apellidos', $('#inputApellidos').val());
        }
        formData.append('role', $('#inputRole').val());
        formData.append('email', $('#inputEmail').val());

        formData.append('password', $('#inputPasswordUser').val());

        xhr.onreadystatechange = () => {

            if (xhr.readyState === 4) {
                if (xhr.status === 201 || xhr.status === 200) {
                    obtenerAlertSwal('Se ha registrado con éxito.', 'Registro exitoso!')
                        .then(() => location.href = "/perfil/sistemas")
                } else {
                    obtenerAlertSwal(xhr.responseText, 'Error!!', 'error');
                }
            }

        };
        xhr.open('POST', "/usuario?=noGuardarSesion=true", true);

        xhr.send(formData);

    });

});