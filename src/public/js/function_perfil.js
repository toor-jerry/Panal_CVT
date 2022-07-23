var terminoBusquedaTemp = ""
$(document).ready(function() {
    terminoBusquedaTemp = $("input[name='keyword']").val();
    $('#'+$('#informacionUsuarioID').val()).prop('selected', true);

    var mark = function() {

        // Read the keyword
        var keyword = $("input[name='keyword']").val();
        // Determine selected options
        var options = {
            "separateWordSearch": false,
             "diacritics": false,
        };
    
        // Remove previous marked elements and mark
        // the new keyword inside the context
        $(".context").unmark({
          done: function() {
            $(".context").mark(keyword, options);
          }
        });
      };
    
      $("input[name='keyword']").on("input", mark);
      $(".context").mark(terminoBusquedaTemp);
    // ==========================
    // Listen Sockets
    // ==========================

    /***************************
     * Listen cites
     ***************************/

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

    // New cite
    socket.on('new-cite-registered-admin', function(res) {

        var cite = res.data; // cite created by a user

        if (cite.area == $("#areaName").attr('name')) { // if area cite is this
            var nCites = Number($("#nCitesTopBar").text()); // ncites to number
            if (nCites == NaN || nCites == undefined || nCites == null) { // if error
                nCites = 0;
            }

            // Notifications
            $("#nCitesTopBar").text(nCites + 1); // update ncites

            $("#cites_container").append(createCiteNotif(cite)); // add notification
        }

    });


    // Delete cite
    socket.on('delete-cite-registered-admin', function(res) {

        var cite = res.data; // cite created by a user

        if (cite.area == $("#areaName").attr('name')) { // if area cite is this
            var nCites = Number($("#nCitesTopBar").text()); // ncites to number
            if (nCites == NaN || nCites == undefined || nCites == null) { // if error
                nCites = 0;
            }

            // Notifications
            if (nCites > 0) {
                $("#nCitesTopBar").text(nCites - 1); // update ncites
            } else {
                $("#nCitesTopBar").text('0'); // update ncites
            }

            // Remove notif
            $(`#${cite._id}-notif`).remove();
        }

    });

    $("#form-search").submit(function(event) {

        event.preventDefault();
            buscar();
    });



    /***************************
     * Listen Users
     ***************************/
    // New user
    socket.on('new-user-registered-admin', function(res) {
        var user = res.data; // user created

        // Table item
        $("#tbody_users").append(createFieldTableUsers(user));
    });


    // Delete user
    socket.on('delete-user-registered-admin', function(res) {

        var user = res.data; // user created

        // Remove field table 
        $(`#${user._id}-field`).remove();

    });

    $('#conveniosSelect').on('change', function() {
        let value = $(this).val();
        if(value == "0") {
            window.location.href = "/perfil";
        } else {
            window.location.href = "/perfil/informacion/" + value;
        }
      });

});


// delete user
function deleteUser(user) {

    // user not this user auth
    if (user === getIdUserAuth()) {
        return Swal.fire({
            title: 'Operación no permitida!',
            text: `No se pude eliminar asi mismo!`,
            icon: 'warning',
        });
    }

    showQuestion('¿Está seguro?', 'Esta opción eliminará al usuario!')
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Eliminando', 'Por favor espere....');

                // Delete request
                $.ajax({
                    url: '/user/' + user,
                    type: 'DELETE',
                    success: function() {
                        Swal.fire({
                            title: 'Cuenta eliminada!',
                            text: `Cuenta eliminada correctamente!`,
                            icon: 'success',
                        })
                    },
                    error: function(errResp) {
                        showError(errResp, true); // show error alert
                    }
                });

            }
        })
}



function buscar() {
    var terminoBusqueda = $("input[name='keyword']").val();
    if (terminoBusqueda == terminoBusquedaTemp) {
        return;
    }
    terminoBusquedaTemp = terminoBusqueda;
        if (terminoBusqueda == '') {
            window.location.href = "/perfil";
        } else {
            window.location.href = "/vacante/buscar/"+terminoBusqueda;
        }
    
}