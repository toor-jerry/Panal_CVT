$(document).ready(function() {
    // ==========================
    // Listen Sockets
    // ==========================

    /***************************
     * Listen cites
     ***************************/

    // Listen status connection
    socket.on('connect', function() {
        $('#alert_connection').hide();
        $('#statusCon').removeClass('text-danger');
        $('#statusCon').addClass('text-success');
    });

    socket.on('disconnect', function() {
        $('#alert_connection').show();
        $('#statusCon').addClass('text-danger');
        $('#statusCon').removeClass('text-success');
    });

    // onsubmit modal
    $("#empleo-form").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Loading..", "Por favor espere.");
        // submit data
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        // formData.append('fechaNacimientoDia',dia );

      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
                swal.fire({
                    title: 'Actualización exitosa!',
                    text: 'Se actualizó con éxito la cuenta.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true
                }).then(() => window.location.href = '/cv')
          } else {
            showError(xhr.response, true);
          }
        }

      };
      xhr.open('PUT', '/usuario/actualizar', true);
      
      xhr.send(formData);
    });


});

