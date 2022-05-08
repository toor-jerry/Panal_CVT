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

            $("#cites_container").append(createCiteNotif(cite));
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
     * Listen Areas
     ***************************/
    // New area
    socket.on('new-area-registered', function(res) {
        var area = res.data; // area created

        // Table item
        $("#tbody_areas").append(createFieldTableAreas(area));
    });


    // Delete area
    socket.on('delete-area-registered', function(res) {

        var area = res.data; // area deleted

        // Remove field table 
        $(`#${area._id}-field`).remove();

    });


    // onsubmit area form
    $("#area-form").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Loading..", "Por favor espere.");

        // submit data
        $.post("/area", getDataArea(), function() {})
            .done(function() {

                resetModalArea(); // hide modal

                swal.fire({
                    title: 'Registro exitoso!',
                    text: 'El área se ha registrado con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    showLoaderOnConfirm: true
                });
            })
            .fail(function(errResp) {
                showError(errResp); // show error alert
            });
    });

});

// delete area
function deleteArea(area) {

    showQuestion('¿Está seguro?', 'Esta opción eliminará el área!')
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Eliminando', 'Por favor espere....');

                // Delete request
                $.ajax({
                    url: '/area/' + area,
                    type: 'DELETE',
                    success: function() {
                        Swal.fire({
                            title: 'Área eliminada!',
                            text: `Área eliminada correctamente!`,
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