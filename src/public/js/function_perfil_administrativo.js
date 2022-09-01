
// delete user
function validarEstatus(userIDParam, perfilStatusActual, estatusParam, emailUsuario) {
    if (perfilStatusActual == estatusParam) {
        return;
    }
    showQuestion('¿Está seguro?', 'Está a punto de actualizar su estatus de este usuario!')
        .then((result) => {
            if (result.value) {

                if (estatusParam == 'Rechazado') {
                    return Swal.fire({
                        title: 'Ingrese un comentario por el cual está rechazando al usuario:',
                        input: 'text',
                        inputAttributes: {
                          autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Look up',
                        showLoaderOnConfirm: true,
                        preConfirm: (msg) => {
                          mensajeRechazo = msg
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                      }).then((result) => {
                        if (result.isConfirmed) {
                          cambiarEstatusBD(userIDParam, estatusParam, result.value, emailUsuario)
                        }
                      })
                } else {
                    cambiarEstatusBD(userIDParam, estatusParam, "Se ha validado su perfil.", emailUsuario)
                }

                
                
            }
        })
}

function cambiarEstatusBD(userIDParam, estatusParam, mensaje = '', emailUsuario = '') {
    // Show loading
    getLoading('Actualizando el estatus..', 'Por favor espere....');

    // put data (create user)
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('perfilVerificado', estatusParam);
    if (mensaje !== '' && emailUsuario !== '') {
        formData.append('mensaje', mensaje);
        formData.append('emailUsuario', emailUsuario);
    }
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
    xhr.open('PUT', '/usuario/actualizar?usuarioId='+userIDParam, true);

    xhr.send(formData);
}