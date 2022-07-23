var genero;

$(document).ready(function () {
    // ==========================
    // Listen Sockets
    // ==========================

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


    $("#hombre").change(function() {
        genero = "Hombre"
    });

    $("#mujer").change(function() {
        genero = "Mujer"
    });
    
});


function guardarDatos(idVacante) {
    let vacanteId = idVacante;
    // show alert loading
    getLoading("Guardando su información...", "Loading..");

    // submit data
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    // Datos del formulario
    formData.append('nombre', $('#inputNombre').val());
    formData.append('apellidos', $('#inputApellidos').val());
    formData.append('licenciatura', $('#licenciatura').val());
    formData.append('matricula', $('#inputMatricula').val());
    formData.append('progreso', $('#progreso').val());
    formData.append('numeroContacto', $('#inputNumero').val());
    formData.append('email', $('#inputCorreo').val());
    formData.append('anio_egreso', $('#inputAnioEgresado').val());
    formData.append('direccion', $('#inputDomicilio').val());
    formData.append('titulo', $('#inputTitulo').val());
    formData.append('cedula', $('#inputCedula').val());
    formData.append('descripcion', $('#descripcion').val());
    
    if (genero) {
        formData.append('genero',genero );
        }

    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
            if (xhr.status === 201 || xhr.status === 200) {
                swal.fire({
                    title: 'Actualización exitosa!',
                    text: 'Su información ha sido actualizada con éxito!',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true
                }).then(() => window.location.href = `/vacante/${vacanteId}`)
            } else {
                showError(xhr.response, true);
            }
        }

    };
    xhr.open('PUT', '/usuario/actualizar', true);

    xhr.send(formData);
}