$(document).ready(function () {
    var apellidos = true;
    $("#inputRole").change(function () {
        if ($(this).val() == "USER_ENTERPRISE") {
            $("#inputApellidos").attr("placeholder", "Razón Social");
            apellidos = true;
        } else {
            $("#inputApellidos").attr("placeholder", "Apellidos");
            apellidos = false;
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
        if (apellidos) {
            formData.append('apellidos', $('#inputApellidos').val());
        } else {
            formData.append('razonSocial', $('#inputApellidos').val());
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
        xhr.open('POST', "/usuario", true);

        xhr.send(formData);

    });

});