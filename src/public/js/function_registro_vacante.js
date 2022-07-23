$(document).ready(function () {
  // ==========================
  // Listen Sockets
  // ==========================

  /***************************
   * Listen cites
   ***************************/

  // Listen status connection
  socket.on("connect", function () {
    $("#alert_connection").hide();
    $("#statusCon").removeClass("text-danger");
    $("#statusCon").addClass("text-success");
  });

  socket.on("disconnect", function () {
    $("#alert_connection").show();
    $("#statusCon").addClass("text-danger");
    $("#statusCon").removeClass("text-success");
  });

  // Al seleccionar la foto
  $("#inputCV").change(function () {
    leerPDF(this);
  });
});

function leerPDF(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    const tipo = "application/pdf";
    let file = input.files[0];
    if (!file.type.match(tipo)) {
      swal.fire({
        title: "Advertencia",
        text: `Seleccione archivos PDF.`,
        icon: "info",
        showLoaderOnConfirm: true,
      });
      return;
    }

    reader.onload = function (e) {
      $("#labelCVPDF").html(file.name);

      // show alert loading
      getLoading("Loading..", "Subiendo currículo vitae...");
      // submit data
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      formData.append("cv", file);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
            swal
              .fire({
                title: "Carga exitosa!",
                text: "Se ha subido su currículo vitae con éxito.",
                icon: "success",
                confirmButtonText: "Aceptar",
                showLoaderOnConfirm: true,
              })
          } else {
            showError(xhr.response, true);
          }
        }
      };
      xhr.open("POST", "/archivos/cv", true);

      xhr.send(formData);
    };
    reader.readAsDataURL(file);
  }
}
