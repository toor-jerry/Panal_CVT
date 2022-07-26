$(document).ready(function() {
    var sector = "Privado";

    $("#privado").change(function() {
        sector = "Privado"
    });

    $("#publico").change(function() {
        sector = "Público"
    });

    $("#social").change(function() {
      sector = "Social"
  });

    // Al seleccionar la foto
  $("#inputRFCFile").change(function () {
    subirArchivo(this, nombreEtiqueta = "labelRFC", carpetaAGuardar = "RFC");
  });

  $("#inputcomprobantesDomicilioFile").change(function () {
    subirArchivo(this, nombreEtiqueta = "labelcomprobantesDomicilio", carpetaAGuardar = "comprobantesDomicilio");
  });

  $("#inputINEFile").change(function () {
    subirArchivo(this, nombreEtiqueta = "labelINE", carpetaAGuardar = "INE");
  });

    // onsubmit modal
    $("#form-verificacion-cuenta").submit(function(event) {
        event.preventDefault();

        // show alert loading
        getLoading("Loading..", "Por favor espere.");
        // submit data
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('rfc',$('#inputRFC').val()  );
        formData.append('nombreContacto',$('#inputNombreContacto').val()  );
        formData.append('razonSocial',$('#inputRazonSocial').val()  );
        formData.append('cargoContacto',$('#inputCargoContacto').val()  );
        formData.append('nombre',$('#inputNombre').val()  );
        formData.append('ubicacion',$('#inputUbicacion').val()  );
        formData.append('email',$('#inputEmail').val()  );
        formData.append('numeroContacto',$('#inputNumero').val()  );


        if (sector) {
            formData.append('sectorEmpresarial',sector );
            }
      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
                swal.fire({
                    title: 'Actualización exitosa!',
                    text: 'Se guardado su información.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true
                }).then(() => window.location.href = '/perfil/verificacion_cuenta_en_proceso')
          } else {
            showError(xhr.response, true);
          }
        }
      };
      xhr.open('PUT', '/usuario/actualizar', true);
      
      xhr.send(formData);
    });
});


function subirArchivo(archivo, nombreEtiqueta, carpetaAGuardar) {
    if (archivo.files && archivo.files[0]) {
      var reader = new FileReader();
  
      let file = archivo.files[0];
      if (!file.type.match("application/pdf")) {
        swal.fire({
          title: "Advertencia",
          text: `Seleccione archivos PDF.`,
          icon: "info",
          showLoaderOnConfirm: true,
        });
        return;
      }
  
      reader.onload = function (e) {
        $("#"+ nombreEtiqueta).html(file.name);
        // show alert loading
        getLoading("Loading..", "Subiendo archivo...");
        // submit data
        const formData = new FormData();
        const xhr = new XMLHttpRequest();
        formData.append("file", file);
  
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 201 || xhr.status === 200) {
              swal
                .fire({
                  title: "Carga exitosa!",
                  text: "Se ha subido el archivo con éxito.",
                  icon: "success",
                  confirmButtonText: "Aceptar",
                  showLoaderOnConfirm: true,
                }).then(() => {
                    $("#fechaModificacion"+carpetaAGuardar).html(new Date().toLocaleString())
                })
            } else {
              showError(xhr.response, true);
            }
          }
        };
        xhr.open("PUT", "/archivos/archivo/"+carpetaAGuardar, true);
  
        xhr.send(formData);
      };
      reader.readAsDataURL(file);
    }
  }
  