$(document).ready(function () {
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
      obtenerAlertSwal(`Seleccione archivos PDF.`, "Advertencia","info");
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
            obtenerAlertSwal("Se ha subido su currículo vitae con éxito.","Carga exitosa!")
          } else {
            obtenerAlertSwal(`A ocurrido un error.\n ${JSON.parse(xhr.response).msg}`, 'Error!', 'warning').then(() => location.href = "/perfil");
          }
        }
      };
      xhr.open("POST", "/archivos/cv", true);

      xhr.send(formData);
    };
    reader.readAsDataURL(file);
  }
}


function postular(vacanteID, empresaID) {
  let idVacante = vacanteID;
  let idEmpresa = empresaID;
      // show alert loading
      getLoading("Loading..", "Postulando a la vacante...");
      // submit data
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      formData.append('vacante', idVacante);
      formData.append('empresa', idEmpresa);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
            obtenerAlertSwal("Se ha postulado con éxito a la vacante.","Postulación exitosa!")
            .then(() => {
                location.href = "/perfil"
              })
          } else {
            obtenerAlertSwal(`A ocurrido un error.\n ${JSON.parse(xhr.response).msg}`, 'Error!', 'warning').then(() => location.href = "/perfil");
          }
        }
      };
      xhr.open("POST", "/postulacion", true);

      xhr.send(formData);
  }