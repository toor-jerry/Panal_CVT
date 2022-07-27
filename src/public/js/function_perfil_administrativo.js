var userID = '';
var estatus = '';
$(document).ready(function () {

    // ==========================
    // Listen Sockets
    // ==========================

    /***************************
     * Listen cites
     ***************************/

    // Listen status connection
    socket.on('connect', function () {
        $('#alert_connection').hide();
        $('#statusCon').removeClass('text-danger');
        $('#statusCon').addClass('text-success');
    });

    socket.on('disconnect', function () {
        $('#alert_connection').show();
        $('#statusCon').addClass('text-danger');
        $('#statusCon').removeClass('text-success');
    });

});


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
                            swal.fire({
                                title: 'Actualización exitosa!',
                                text: 'Se ha actualizado el estatus con éxito.',
                                icon: 'success',
                                confirmButtonText: 'Aceptar',
                                showLoaderOnConfirm: true
                            }).then(() => location.reload());
                        } else {
                            showError(xhr.response, true);
                        }
                    }

                };
                xhr.open('PUT', '/usuario/actualizar?usuarioId='+userID, true);

                xhr.send(formData);
            }
        })
}
