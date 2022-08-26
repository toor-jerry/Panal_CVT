var userID = '';
var estatus = '';

// delete user
function validarEstatus(userIDParam, estatusParam, estatusParam) {
    
    if (userIDParam != userID && estatusParam != estatus) {
    userID = userIDParam;
    estatus = estatusParam;
    } else {
        return;
    }
    showQuestion('¿Está seguro?', 'Está a punto de actualizar su estatus de este usuario!')
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Actualizando el estatus..', 'Por favor espere....');

                // put data (create user)
                const formData = new FormData();
                const xhr = new XMLHttpRequest();

                formData.append('perfilVerificado', estatusParam);
                xhr.onreadystatechange = () => {

                    if (xhr.readyState === 4) {
                        if (xhr.status === 201 || xhr.status === 200) {
                            obtenerAlertSwal('Se ha actualizado el estatus con éxito.')
                            .then(() => location.reload());
                        } else {
                            obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
                        }
                    }

                };
                xhr.open('PUT', '/usuario/actualizar?usuarioId='+userID, true);

                xhr.send(formData);
            }
        })
}