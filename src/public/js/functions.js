var audio = new Audio('/audio/new-cite.mp3');


$('#alert_connection').hide(); // hide alert "No connection"

var socket = io(); // initialization sockets

var toastMixin = Swal.mixin({ // create toast
    toast: true,
    icon: 'success',
    title: 'General Title',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
});

// Reset modal Area
function resetModalArea() {
    $('#inputAreaName').val('');
    $('#inputAreaDescription').val('');
    $('#areaModal').modal('hide');
}

// Data form area
function getDataArea() {
    return { name: $('#inputAreaName').val(), description: $('#inputAreaDescription').val() };
}

// Data form cite
function getDataCite() {
    return { month: $('#inputMonth').val(), day: $('#inputDay').val(), hour: $('#inputHour').val(), description: $('#inputDescription').val(), area: $('#inputAreaCite').val(), full_name: $('#inputFullName').val(), email: $('#inputEmailCite').val(), whatsapp: $('#inputWhatsapp').val() };
}

// Data form user register
function getDataUser() {
    return { name: $('#inputFirstName').val(), last_name: $('#inputLastName').val(), email: $('#inputEmail').val(), password: $('#inputPassword').val(), area: $('#inputArea').val() };
}

// Data form user login
function getDataUserLogin() {
    return { email: $('#inputEmail').val(), password: $('#inputPassword').val() };
}
// Data form email
function getDataEmail() {
    return { email: $('#inputEmail').val() };
}

// get error
function showError(errResp, reload) {
    let err = errResp.responseJSON;

    var error = err;
    if (err.err && err.err.msg) {
        error = err.err.msg;
    }
    // if error reload window
    swal.fire({
        title: 'Error!',
        text: `A ocurrido un error.\n ${err.msg} \n ${error}`,
        icon: 'error',
    }).then(result => {
        if (reload === true) {
            location.reload();
        }
    });
}

// get alert
function showAlert(errResp, reload) {
    let err = errResp.responseJSON;

    var error = err;
    if (err.err && err.err.msg) {
        error = err.err.msg;
    }
    // if error reload window
    swal.fire({
        title: err.msg,
        icon: 'warning',
    }).then(result => {
        if (reload === true) {
            location.reload();
        }
    });
}

// return date form
function getDate() {
    return $('#inputAnio').val() + '-' + $('#inputMonth').val() + '-' + $('#inputDay').val();
}

// return loading
function getLoading(title, txt) {
    return swal.fire({
        title: title,
        text: txt,
        imageUrl: "/img/Wedges-3s-200px.svg",
        button: false,
        closeOnClickOutside: false,
        closeOnEsc: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
        `
    });
}

// get horary by date and area
function getHours(area, date) {
    $.get(`/cite/hours/${area}/${date}`, function() {})
        .done(function(res) {

            toastMixin.fire({
                animation: true,
                title: 'Horarios obtenidos correctamente!!'
            });

            $("#inputHour").remove(); // remove horary select

            // add new horary
            $("#hourContainer").append('<select class="form-control" id="inputHour"></select>');

            var data = res.data;

            // add option at horary select
            $.each(data, function(key, value) {
                var opt = '<option id="' + value + '-option" value="' + value + '">' + value + '</option>';
                $("#inputHour").append(opt);
            });

        })
        .fail(function(errResp) {
            let err = errResp.responseJSON;
            swal.fire({
                title: 'Error!',
                text: `A ocurrido un error.\n ${err.msg} \n ${err.err}`,
                icon: 'error',
            }).then(() => location.reload());

        });
}

// show alert question
function showQuestion(title, text, icon = 'warning') {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonText: 'De acuerdo!',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    });
}

// show alert area required
function showDataInvalidArea() {
    return swal.fire(
        'Datos inválidos!!',
        'Debe seleccionar un área.',
        'warning'
    );
}

// create new notification
function createCiteNotif(cite) {
    return `<a class="dropdown-item d-flex align-items-center" href="/cite/show/${cite._id}" id="${cite._id}-notif">
                <div class="mr-3">
                    <div class="icon-circle bg-success">
                        <i class="fas fa-file-alt text-white"></i>
                    </div>
                </div>
                <div>
                    <div class="small text-gray-500">${cite.date} - ${cite.hour}</div>
                    <span class="font-weight-bold">${cite.description}</span>
                </div>
            </a>`;
}

// add field to cites table
function createFieldTableCites(cite) {
    return `<tr id="${cite._id}-field">
                <td>${cite.date}</td>
                <td>${cite.hour}</td>
                <td>${cite.description}</td>
                <td>
                    <a class="btn btn-danger" onclick="deleteCite('${cite._id}')">
                    <i class="fas fa-trash-alt"></i>
                    </a>
                </td>
                <td>
                    <a class="btn btn-info" href="/cite/show/${cite._id}">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>`;
}

// add field to users table
function createFieldTableUsers(user) {
    return `<tr id="${user._id}-field">
                <td>${user.name}</td>
                <td>${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.area.name}</td>
                <td>
                    <a class="btn btn-danger" onclick="deleteUser('${user._id}')">
                    <i class="fas fa-trash-alt"></i>
                    </a>
                </td>
            </tr>`;
}

// add field to areas table
function createFieldTableAreas(area) {
    return `<tr id="${area._id}-field">
                <td>${area.name}</td>
                <td>${area.description}</td>
                <td>
                    <a class="btn btn-danger" onclick="deleteArea('${area._id}')">
                    <i class="fas fa-trash-alt"></i>
                    </a>
                </td>
            </tr>`;
}

// delete localStorage
function deleteStorage() {
    localStorage.removeItem('email');
    localStorage.removeItem('remember');
}

// save email and check 'remember' in localStorage
function saveStorage() {
    localStorage.setItem('email', $('#inputEmail').val());
    localStorage.setItem('remember', true);
}

// return name user auth
function getIdUserAuth() {
    return $('#user_info').attr('name');
}

// add area option
function addArea(area, inputId) {
    var opt = `<option id="${area._id}-option-area" value="${area._id}">${area.name} - ${area.description}</option>`;
    $("#" + inputId).append(opt);
}


jQuery(function($) {

    $(".security-password").strength({
        templates: {
            toggle: '<i class="fa fa-eye {toggleClass}" aria-hidden="true" style="cursor: pointer; font-size: 25px; align-self: center;"></i>'
        },
        scoreLables: {
            empty: 'Vacía',
            invalid: 'Contraseña Inválida',
            weak: 'Débil',
            good: 'Buena',
            strong: 'Fuerte'
        },
        scoreClasses: {
            empty: '',
            invalid: 'alert alert-danger',
            weak: 'alert alert-warning',
            good: 'alert alert-info',
            strong: 'alert alert-success'
        },

    });
});


// Borrar vacante
function borrarVacante(vacante, nombreVacante) {

    showQuestion('¿Está seguro?', `Esta opción eliminará la vacante "${nombreVacante}"!`)
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Eliminando', 'Por favor espere....');

                // Delete request
                $.ajax({
                    url: '/vacante/' + vacante,
                    type: 'DELETE',
                    success: function() {
                        Swal.fire({
                            title: 'Vacante eliminada!',
                            text: `La vacante '${nombreVacante}' eliminada correctamente!`,
                            icon: 'success',
                        })
                        .then(() => location.reload())
                    },
                    error: function(errResp) {
                        showError(errResp, true); // show error alert
                    }
                });

            }
        })
}