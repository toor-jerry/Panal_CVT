var genero;


function guardarDatos(idVacante) {
    let vacanteId = idVacante;
    // show alert loading
    getLoading("Guardando su información...");

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
                obtenerAlertSwal('Su información ha sido actualizada con éxito!')
                .then(() => window.location.href = `/vacante/${vacanteId}`)
            } else {
                obtenerAlertSwal(`A ocurrido un error.\n ${JSON.parse(xhr.response).msg}`, 'Error!', 'warning').then(() => location.href = "/perfil");
            }
        }

    };
    xhr.open('PUT', '/usuario/actualizar', true);

    xhr.send(formData);
}