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
});


