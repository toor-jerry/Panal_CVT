$(document).ready(function() {
    $("#buttonCrearVacante").hide();

    // onsubmit form
    $("#form-vacante").submit(function(event) {

        event.preventDefault();

        showQuestion('¿Está seguro?', 'Está a punto de publicar una nueva vacante.', 'info')
        .then((result) => {
            if (result.value) {
            // show alert loading
            getLoading("Registrando la vacante...");

            const idEmpresa = $('#empresasSelect').val();
            let rutaAPI = '/vacante';
            if (idEmpresa != null) {
                rutaAPI = `/vacante?empresaId=${idEmpresa}`;
            }
            // submit data
            $.post(rutaAPI, { 
                                puesto: $('#inputPuesto').val(),
                                salario: $('#inputSalario').val(),
                                horarios: $('#inputHorarios').val(),
                                funciones: $('#inputFunciones').val(),
                                notas: $('#inputNotas').val()
                            }, function() {})
                .done(function(res) {

                    obtenerToast(2000).fire({
                            animation: true,
                            title: `La vacante "${res.data.puesto}" ha sido creada con éxito!!`
                        })
                        .then(() => location.reload())
                })
                .fail(function(errResp) {
                    obtenerToast(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
                });
    }});
});
});

// Borrar vacante
function borrarVacante(vacante, nombreVacante) {

    showQuestion('¿Está seguro?', `Esta opción eliminará la vacante "${nombreVacante}"!`)
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Eliminando', 'Por favor espere....');

                // Delete request
                $.ajax({
                    url: '/vacante/' + vacante,
                    type: 'DELETE',
                    success: function() {
                        obtenerAlertSwal(`La vacante '${nombreVacante}' eliminada correctamente!`,'Vacante eliminada!')
                        .then(() => location.reload())
                    },
                    error: function(errResp) {
                        obtenerToast(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
                    }
                });

            }
        })
}