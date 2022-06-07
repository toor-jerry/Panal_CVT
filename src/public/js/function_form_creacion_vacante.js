$(document).ready(function() {
    // ==========================
    // Listen Sockets
    // ==========================

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


    // onsubmit form
    $("#form-vacante").submit(function(event) {

        event.preventDefault();
        showQuestion('¿Está seguro?', 'Está a punto de publicar una nueva vacante.', 'info')
        .then((result) => {
            if (result.value) {
            // show alert loading
            getLoading("Registrando la vacante...", "Loading.." );

            // submit data
            $.post("/vacante", { 
                                puesto: $('#inputPuesto').val(),
                                salario: $('#inputSalario').val(),
                                horarios: $('#inputHorarios').val(),
                                funciones: $('#inputFunciones').val(),
                                notas: $('#inputNotas').val()
                            }, function() {})
                .done(function(res) {

                    var toastLogin = Swal.mixin({ // create toast
                        toast: true,
                        icon: 'success',
                        title: 'General Title',
                        animation: false,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true
                    });
                    toastLogin.fire({
                            animation: true,
                            title: `La vacante "${res.data.puesto}" ha sido creada con éxito!!`
                        })
                        .then(() => location.reload())
                })
                .fail(function(errResp) {
                    showAlert(errResp); // show error alert
                });
    }});
});
});