$(document).ready(function() {

    var genero;
    var imagen;

    $("#hombre").change(function() {
        genero = "Hombre"
    });

    $("#mujer").change(function() {
        genero = "Mujer"
    });

    // Al seleccionar la foto
    $("#inputFoto").change(function() {
        leerImagen(this);
    });

    // onsubmit form
    $("#form-personalizacion").submit(function(event) {

        event.preventDefault();
            // show alert loading
            getLoading("Actualizando la información...", "Loading.." );

            // submit data

            var dia = $('#fecha_nacimiento_dia').val();
            var mes = $('#fecha_nacimiento_mes').val();
            var anio = $('#fecha_nacimiento_anio').val();
            var fecha_nac = dia + mes + anio;
        if (fecha_nac !== '' && (dia == '' || mes == '' || anio == '')) {
            fecha_nac = '';
            swal.fire({
                title: 'Advertencia',
                text: `Llene correctamente la fecha de nacimiento.\n`,
                icon: 'info',
                showLoaderOnConfirm: true
            });
            return;
        }

        var data = { 
            licenciatura: $('#licenciatura').val(),
            genero: genero,
            fechaNacimientoDia: dia,
            fechaNacimientoMes: mes,
            fechaNacimientoAnio: anio,
            progreso: $('#progreso').val(),
            descripcion: $('#descripcion').val(),
            imagen
        };
        // put data (create user)
        const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('foto',imagen );

      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
                swal.fire({
                    title: 'Actualización exitosa!',
                    text: 'Se actualizó con éxito la cuenta.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true
                }).then(() => window.location.href = '/perfil')
          } else {
            showError(xhr.response, true);
          }
        }

      };
      xhr.open('PUT', '/usuario/actualizar', true);
      
      xhr.send(formData);

});



function leerImagen(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        const tipo = /image.*/
        if (!input.files[0].type.match(tipo)){
            swal.fire({
                title: 'Advertencia',
                text: `Seleccione imágenes.`,
                icon: 'info',
                showLoaderOnConfirm: true
            });
            return
        }
        
        imagen = input.files[0];
        reader.onload = function(e) {
            $("#img-previo").attr("src", e.target.result); // Se renderiza la imagen
    }
    reader.readAsDataURL(input.files[0]);
}
}

});

