$(document).ready(function() {
    // ==========================
    // Listen Sockets
    // ==========================

    // Listen status connection
    socket.on('connect', function() {
        $('#alert_connection').hide();
        $('#statusCon').removeClass('text-danger');
        $('#statusCon').addClass('text-success');
    });

    socket.on('disconnect', function() {
        $('#alert_connection').show();
        $('#statusCon').addClass('text-danger');
        $('#statusCon').removeClass('text-success');
    });

    // onsubmit modal
    $("#empleo-form").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Loading..", "Por favor espere.");
        // submit data
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('nombreEmpresa',$('#inputEmpleoNombreEmpresa').val()  );
        formData.append('puestoDesempenado',$('#inputPuestoDesempenado').val()  );
        formData.append('periodo',$('#inputPeriodo').val()  );
        formData.append('funciones',$('#inputExpLaboral').val());
        formData.append('salario',$('#inputSalario').val()  );

      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
                swal.fire({
                    title: 'Actualización exitosa!',
                    text: 'Se agregó un nuevo empleo.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true
                }).then(() => window.location.href = '/cv')
          } else {
            showError(xhr.response, true);
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
              swal.fire({
                  title: 'Actualización exitosa!',
                  text: 'Se agregó una nueva formación.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  showLoaderOnConfirm: true
              }).then(() => window.location.href = '/cv')
        } else {
          showError(xhr.response, true);
        }
      }

    };
    xhr.open('PUT', '/usuario/actualizar/formacion', true);
    
    xhr.send(formData);
  });

});

