var terminoBusquedaTemp = ""
$(document).ready(function() {


    terminoBusquedaTemp = $("input[name='keyword']").val();
    $('#'+$('#informacionUsuarioID').val()).prop('selected', true);

    var mark = function() {

        // Read the keyword
        var keyword = $("input[name='keyword']").val();
        // Determine selected options
        var options = {
            "separateWordSearch": false,
             "diacritics": false,
        };
    
        // Remove previous marked elements and mark
        // the new keyword inside the context
        $(".context").unmark({
          done: function() {
            $(".context").mark(keyword, options);
          }
        });
      };
    
      $("input[name='keyword']").on("input", mark);
      $(".context").mark(terminoBusquedaTemp);

    $("#form-search").submit(function(event) {

        event.preventDefault();
            buscar();
    });


    $('#conveniosSelect').on('change', function() {
        let value = $(this).val();
        if(value == "0") {
            window.location.href = "/perfil";
        } else {
            window.location.href = "/perfil/informacion/" + value;
        }
      });

});


// delete user
function deleteUser(user) {

    // user not this user auth
    if (user === getIdUserAuth()) {
        return Swal.fire({
            title: 'Operación no permitida!',
            text: `No se pude eliminar asi mismo!`,
            icon: 'warning',
        });
    }

    showQuestion('¿Está seguro?', 'Esta opción eliminará al usuario!')
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Eliminando', 'Por favor espere....');

                // Delete request
                $.ajax({
                    url: '/user/' + user,
                    type: 'DELETE',
                    success: function() {
                        obtenerAlertSwal('Cuenta eliminada!',`Cuenta eliminada correctamente!`)
                    },
                    error: function(errResp) {
                        obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
                    }
                });

            }
        })
}



function buscar() {
    var terminoBusqueda = $("input[name='keyword']").val();
    if (terminoBusqueda == terminoBusquedaTemp) {
        return;
    }
    terminoBusquedaTemp = terminoBusqueda;
        if (terminoBusqueda == '') {
            window.location.href = "/perfil";
        } else {
            window.location.href = "/vacante/buscar/"+terminoBusqueda;
        }
    
}


// aceptar postulante
function actualizarStatusPostulacion(postulacionID, status) {

    showQuestion('¿Está seguro?', 'Esta opción actualizará el status de la postulación!')
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Reclutando', 'Por favor espere....');

                
                $.ajax({
                    url: `/postulacion/actualizar/reclutar/${postulacionID}/${status}`,
                    type: 'PUT',
                    success: function() {
                        obtenerAlertSwal('Usuario "' + status + '"!',`Se ha '${status}' al postulante con éxito, se ha enviado un correo electrónico al usuario.`)
                        .then(() => location.reload());
                    },
                    error: function(errResp) {
                        obtenerAlertSwal(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
                    }
                });
            }
            });
}

// aceptar postulante
function enviarURLVerificacion() {
                // Show loading
                getLoading('Enviando email..', 'Por favor espere....');

                $.ajax({
                    url: `/usuario/verificacion/cuenta`,
                    type: 'POST',
                    success: function() {
                        obtenerToast(`Se ha enviado con éxito a su correo el enlace verificación, por favor revisar.`, '-')
                    },
                    error: function(errResp) {
                        obtenerAlertSwal(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
                    }
                });

}

function buscar() {
    var terminoBusqueda = $("input[name='keyword']").val();
    if (terminoBusqueda == terminoBusquedaTemp) {
        return;
    }
    terminoBusquedaTemp = terminoBusqueda;
        if (terminoBusqueda == '') {
            window.location.href = "/perfil";
        } else {
            window.location.href = "/vacante/buscar/"+terminoBusqueda;
        }
    
}