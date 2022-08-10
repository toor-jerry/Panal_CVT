var socket = io(); // initialization sockets
var audioInformacion = new Audio('/audio/Info-tone.mp3');
var audioInformacionError = new Audio('/audio/Error-sound-effect.mp3');
var audioInformacionSuccess = new Audio('/audio/Success-sound-effect.mp3');
var audioNotificacion = new Audio('/audio/notificacion.mp3');
var imagen;
$(document).ready(function () {
    // ==========================
    // Listen Sockets
    // ==========================
    /***************************
     * Listen cites
     ***************************/


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

        // Añade
        $("#nCitesTopBar").text(nCites + 1); // update ncites

        $("#cites_container").append(createCiteNotif(cite)); // add notification
    }

});

    // Listen status connection
    socket.on('connect', function () {
        $('#alert_connection').hide();
        $('#statusCon').removeClass('text-danger');
        $('#statusCon').addClass('text-success');
    });

    socket.on('disconnect', function () {
        $('#alert_connection').show();
        $('#statusCon').addClass('text-danger');
        $('#statusCon').removeClass('text-success');
    });

    $("#hombre").change(function () {
        genero = "Hombre"
    });

    $("#mujer").change(function () {
        genero = "Mujer"
    });

    // Al seleccionar la foto
    $("#inputFoto").change(function () {
        leerImagen(this);
    });

    if (new URLSearchParams(window.location.search).has('limitNotificaciones'))
    {
        $('#dropdown-notificaciones').trigger('click');
    }

// onsubmit modal
$("#cambioPassword-form").submit(function (event) {

    event.preventDefault();
    if ($('#inputPassword').val() !== '' && PasswordStrength.test('', $('#inputPassword').val()).score <= 35) {
        return obtenerAlertSwal('Por favor mejore la seguridad de su contraseña!!', 'Datos inválidos!!','warning');
    }

    // show alert loading
    getLoading("Loading..", "Por favor espere.");
    // submit data
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('password', $('#inputPassword').val());
    formData.append('recuperacionPassword', false);
    

    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
            if (xhr.status === 201 || xhr.status === 200) {
                obtenerAlertSwal('Se actualizó correctamente su contraseña.')
                    .then(() => location.reload());
            } else {
                obtenerToast(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
            }
        }

    };
    xhr.open('PUT', '/usuario/actualizar', true);

    xhr.send(formData);
});
});

function marcarNotificacionesComoLeidas(notificacionesTotal) {
        // show alert loading
        getLoading("Loading..", "Por favor espere.");
        // submit data
        const formData = new FormData();
        const xhr = new XMLHttpRequest();

        formData.append('notificacionesLeidas', notificacionesTotal);

      xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
          if (xhr.status === 201 || xhr.status === 200) {
            
            obtenerAlertSwal('No tiene nuevas notificaciones.')
                .then(() => window.location.reload())
          } else {
            obtenerToast(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
          }
        }

      };
      xhr.open('PUT', '/usuario/actualizar', true);
      
      xhr.send(formData);
}

function obtenerAlertSwal(text = 'Se guardado su información.', title = 'Actualización exitosa!', icon = 'success') {
    if (icon == 'success') {
        audioInformacionSuccess.play();
    } else if (icon == 'info') {
        audioInformacion.play();
    } else{
        audioInformacionError.play();
    }
    return swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'Aceptar',
        showLoaderOnConfirm: true
    });
}

function obtenerToast(time = 1000) {
    audioInformacionSuccess.play();
    return Swal.mixin({ // create toast
        toast: true,
        icon: 'success',
        title: 'General Title',
        animation: false,
        position: 'center',
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true
    });
}



$('#alert_connection').hide(); // hide alert "No connection"

function leerImagen(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        const tipo = /image.*/
        if (!input.files[0].type.match(tipo)) {
            swal.fire({
                title: 'Advertencia',
                text: `Seleccione imágenes.`,
                icon: 'info',
                showLoaderOnConfirm: true
            });
            return
        }

        imagen = input.files[0];
        reader.onload = function (e) {
            $("#img-previo").attr("src", e.target.result); // Se renderiza la imagen
        }
        reader.readAsDataURL(input.files[0]);
    }
}




// return loading
function getLoading(title, txt = "Loading...") {
    audioInformacion.play();
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


// show alert question
function showQuestion(title, text, icon = 'warning') {
    audioInformacion.play();
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


jQuery(function ($) {

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


// delete user
function deleteUser(userId) {


    showQuestion('¿Está seguro?', 'Esta opción eliminará al usuario!')
        .then((result) => {
            if (result.value) {

                // Show loading
                getLoading('Eliminando', 'Por favor espere....');

                // Delete request
                $.ajax({
                    url: '/usuario/' + userId,
                    type: 'DELETE',
                    success: function() {
                        obtenerAlertSwal(`Cuenta eliminada correctamente!`,'Cuenta eliminada!')
                        .then(() => $(`#${userId}-field`).remove())
                    },
                    error: function(errResp) {
                        obtenerToast(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
                    }
                });

            }
        })
}