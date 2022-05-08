$(document).ready(function() {
    // ==========================
    // Listen Sockets
    // ==========================

    // New cite
    socket.on('new-cite-registered-admin', function(res) {

        var cite = res.data; // cite created by a user

        if (cite.area == $("#areaName").attr('name')) { // if area cite is this
            var nCites = Number($("#nCitesTopBar").text()); // ncites to number
            if (nCites == NaN || nCites == undefined || nCites == null) { // if error
                nCites = 0;
            }
            audio.play();
            // Notifications
            $("#nCitesTopBar").text(nCites + 1); // update ncites

            $("#cites_container").append(createCiteNotif(cite));

            // Table item
            $("#tbody_cites").append(createFieldTableCites(cite));
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

            // Remove field table 
            $(`#${cite._id}-field`).remove();

            // Remove notif
            $(`#${cite._id}-notif`).remove();
        }

        /***************************
         * Listen Areas
         ***************************/
        // New area
        socket.on('new-area-registered', function(res) {

            var area = res.data; // cite created by a user
            addArea(area, 'inputAreaCite');

        });

        // Delete area
        socket.on('delete-area-registered', function(res) {

            var area = res.data; // cite created by a user
            // Remove field table 
            $(`#${area._id}-field`).remove();

        });

    });


});

// delete cite
function deleteCite(cite) {

    showQuestion('¿Está seguro?', 'Esta opción eliminará la cita!')
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Eliminando', 'Por favor espere....');

                // Delete request
                $.ajax({
                    url: '/cite/' + cite,
                    type: 'DELETE',
                    success: function() {
                        Swal.fire({
                            title: 'Cita eliminada!',
                            text: `Cita eliminada correctamente!`,
                            icon: 'success',
                        }).then(() => location.href = "/cite/all")
                    },
                    error: function(errResp) {
                        showError(errResp, true); // show alert delete
                    }
                });

            }
        })
}