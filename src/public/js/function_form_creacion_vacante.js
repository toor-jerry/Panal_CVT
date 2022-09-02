var tipoVacante = "Laboral"
$(document).ready(function () {
    $("#buttonCrearVacante").hide();

    $("#tipoLaboralSelect").change(function () {
        if ($(this).val() == "Laboral") {
            $("#salarioInput").show()
        } else {
            $("#salarioInput").hide()
        }

        tipoVacante = $(this).val()
    })
    // onsubmit form
    $("#form-vacante").submit(function (event) {

        event.preventDefault();

        const idEmpresa = $('#empresasSelect').val();
                    let rutaAPI = '/vacante';
                    if (idEmpresa != null) {
                        rutaAPI = `/vacante?empresaId=${idEmpresa}`;
                    }
        showQuestion('¿Está seguro?', 'Está a punto de publicar una nueva vacante.', 'info')
            .then((result) => {
                if (result.value) {
                    // show alert loading
                    getLoading("Registrando la vacante...");

                    // put data (create user)
                    const formData = new FormData();
                    const xhr = new XMLHttpRequest();
                    var puesto = $('#inputPuesto').val()
                    formData.append('puesto', $('#inputPuesto').val());
                    formData.append('horarios', $('#inputHorarios').val());
                    formData.append('funciones', $('#inputFunciones').val());
                    formData.append('notas', $('#inputNotas').val());
                    formData.append('tipoVacante', $('#tipoLaboralSelect').val());

                    if (tipoVacante == "Laboral") {
                        formData.append('salario', $('#inputSalario').val());
                    }
                    xhr.onreadystatechange = () => {

                        if (xhr.readyState === 4) {
                            if (xhr.status === 201 || xhr.status === 200) {
                                obtenerAlertSwal(`La vacante "${puesto}" ha sido creada con éxito!!`)
                                .then(() => window.location.reload());
                            } else {
                                obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
                            }
                        }

                    };
                    
                    xhr.open('POST', rutaAPI, true);

                    xhr.send(formData);
                }
            });
    });
});

// Borrar vacante
function borrarVacante(vacante, nombreVacante, empresa) {

    showQuestion('¿Está seguro?', `Esta opción eliminará la vacante "${nombreVacante}"!`)
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Eliminando', 'Por favor espere....');

                // Delete request
                $.ajax({
                    url: '/vacante/' + vacante + '/' + empresa,
                    type: 'DELETE',
                    success: function () {
                        obtenerAlertSwal(`La vacante '${nombreVacante}' eliminada correctamente!`, 'Vacante eliminada!')
                            .then(() => window.location.reload());
                    },
                    error: function (errResp) {
                        obtenerAlertSwal(`A ocurrido un error.\n ${errResp}`, 'Error!', 'error')
                    }
                });

            }
        })


}