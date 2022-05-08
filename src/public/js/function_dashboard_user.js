$(document).ready(function() {
    // ==========================
    // Listen Sockets
    // ==========================

    /***************************
     * Listen cites
     ***************************/

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