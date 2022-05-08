$(document).ready(function() {

    var area = $('#inputAreaCite').val(); // area selected
    var month = $('#inputMonth').val(); // month selected
    var day = $('#inputDay').val(); // day selected

    // listen sockets
    socket.on('new-cite-registered', function(res) {

        // if date created by other user is not this selected
        if (res.date !== getDate().trim()) {
            return;
        }

        // 'delete' hour of DOM
        $("#inputHour").find('option[id="' + res.hour + '-option"]').remove();
    });

    // on change area
    $('#inputAreaCite').click(function() {

        // if area is equal at old
        if (area === $(this).val()) {
            return;
        }

        // new area value
        area = $(this).val();

        // show alert loading
        getLoading("Obteniendo horarios disponibles....", "Loading..");

        // load new area by date of database
        getHours(area, getDate());
    });

    // on change month
    $("#inputMonth").change(function() {

        // if area is equal at older
        if (month === $(this).val()) {
            return;
        }

        // new month value
        month = $(this).val();

        // show alert loading
        getLoading("Obteniendo horarios disponibles....", "Loading..");

        // get horary by date of database
        getHours(area, getDate());
    });

    // on change day
    $("#inputDay").change(function() {

        // if day is equal at older
        if (day === $(this).val()) {
            return;
        }

        // new day value
        day = $(this).val();

        // show alert loading
        getLoading("Obteniendo horarios disponibles....", "Loading..");

        // get horary  by date
        getHours(area, getDate());
    });

    // submit data 
    $("#form-cite").submit(function(event) {

        // prevent submit
        event.preventDefault();

        // if area no select
        if ($('#inputArea').val() === '0') {
            return showDataInvalidArea();
        }

        // show alert loading
        getLoading('Loading', 'Por favor espere.');

        // submit data
        $.post("/cite", getDataCite(), function() {})
            .done(function() {

                $('#inputDescription').val(''); // reset description input 
                $('#inputFullName').val(''); // reset description input 
                $('#inputEmailCite').val(''); // reset description input 
                $('#inputWhatsapp').val(''); // reset description input 
                swal.fire(
                    'Cita registrada!',
                    'Se ha registrado la cita con éxito.',
                    'success'
                );
            })
            .fail(function(errResp) {
                showError(errResp, true); // show error
            });
    });

});