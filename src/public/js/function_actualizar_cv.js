var imagen;
$(document).ready(function() {

  
    // onsubmit modal
    $("#empleo-form").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Loading..", "Por favor espere.");
        // submit data
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('nombreEmpresa',$('#inputEmpleoNombreEmpresaModal').val()  );
        formData.append('puestoDesempenado',$('#inputPuestoDesempenadoModal').val()  );
        formData.append('periodo',$('#inputPeriodoModal').val()  );
        formData.append('funciones',$('#inputExpLaboralModal').val());
        formData.append('salario',$('#inputSalarioModal').val()  );

      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
            
            obtenerAlertSwal('Se agregó un nuevo empleo.')
                .then(() => window.location.href = '/cv')
          } else {
            obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
          }
        }

      };
      xhr.open('PUT', '/usuario/actualizar/empleo', true);
      
      xhr.send(formData);
    });


    // onsubmit modal
    $("#formacion-form").submit(function(event) {

      event.preventDefault();

      // show alert loading
      getLoading("Loading..", "Por favor espere.");
      // submit data
      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('nombreEscuela',$('#inputEscuela').val()  );
      formData.append('nivelAcademico',$('#inputNivelAcademico').val()  );
      formData.append('periodo',$('#inputPeriodoForm').val()  );

    xhr.onreadystatechange = () => {

      if (xhr.readyState === 4) {
        if (xhr.status === 201 || xhr.status === 200) {
          obtenerAlertSwal('Se agregó una nueva formación.')
               .then(() => window.location.href = '/cv')
        } else {
          obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
        }
      }

    };
    xhr.open('PUT', '/usuario/actualizar/formacion', true);
    
    xhr.send(formData);
  });

});




// Actualizar CV
function actualizarCV() {

  // show alert loading
  getLoading("Loading..", "Por favor espere.");
  // submit data
  const formData = new FormData();
  const xhr = new XMLHttpRequest();
  formData.append('email',$('#inputCorreo').val()  );
  formData.append('numeroContacto',$('#inputNumero').val()  );
  formData.append('nombre',$('#inputNombre').val()  );
  formData.append('apellidos',$('#inputApellidos').val()  );
  formData.append('experienciaLaboral',$('#inputExpLaboral').val()  );
  formData.append('direccion',$('#inputDireccion').val()  );
  formData.append('edad',$('#inputEdad').val()  );

  formData.append('habilidad1', $('#inputHabilidad1').val());
  formData.append('habilidad2', $('#inputHabilidad2').val());
  formData.append('habilidad3', $('#inputHabilidad3').val());
  formData.append('logro1', $('#inputLogro1').val());
  formData.append('logro2', $('#inputLogro2').val());
  formData.append('logro3', $('#inputLogro3').val());


  if (imagen) {
    formData.append('foto',imagen );
  }

xhr.onreadystatechange = () => {

  if (xhr.readyState === 4) {
    if (xhr.status === 201 || xhr.status === 200) {
      obtenerAlertSwal('Se actualizó su CV.')
         .then(() => window.location.href = '/cv')
    } else {
      obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
    }
  }

};
xhr.open('PUT', '/usuario/actualizar', true);

xhr.send(formData);
}

// Borrar empleo
function borrarEmpleo(empleo) {

  showQuestion('¿Está seguro?', 'Esta opción eliminará el empleo!')
      .then((result) => {
          if (result.value) {

              // Show loading
              getLoading('Eliminando', 'Por favor espere....');

              // Delete request
              $.ajax({
                  url: '/usuario/eliminar/empleo/' + empleo,
                  type: 'DELETE',
                  success: function() {
                    obtenerAlertSwal(`Empleo eliminado correctamente!`,'Empleo eliminado!')
                     .then(() => window.location.href = '/cv')
                  },
                  error: function(errResp) {
                    obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
                  }
              });

          }
      })
}

// Borrar estudio
function borrarEstudio(idEstudio) {

  showQuestion('¿Está seguro?', 'Esta opción eliminará el estudio!')
      .then((result) => {
          if (result.value) {

              // Show loading
              getLoading('Eliminando', 'Por favor espere....');

              // Delete request
              $.ajax({
                  url: '/usuario/eliminar/formacion/' + idEstudio,
                  type: 'DELETE',
                  success: function() {
                    obtenerAlertSwal(`Estudio eliminado correctamente!`,'Estudio eliminado!')
                      .then(() => window.location.href = '/cv')
                  },
                  error: function(errResp) {
                    obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
                  }
              });

          }
      })
}

