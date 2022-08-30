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

  $("#inputCartaCompromisoFile").change(function () {
    subirArchivo(this, nombreEtiqueta = "labelCartaCompromiso", carpetaAGuardar = "CartaCompromiso");
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
            obtenerAlertSwal('Se guardado su información.').then(() => window.location.href = '/perfil/verificacion_cuenta_en_proceso')
          } else {
            obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
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
              obtenerAlertSwal("Carga exitosa!","Se ha subido el archivo con éxito.")
              .then(() => {
                    $("#fechaModificacion"+carpetaAGuardar).html(new Date().toLocaleString())
                })
            } else {
              obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
            }
          }
        };
        xhr.open("PUT", "/archivos/archivo/"+carpetaAGuardar, true);
  
        xhr.send(formData);
      };
      reader.readAsDataURL(file);
    }
  }
  