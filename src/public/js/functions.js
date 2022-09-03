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
    socket.on('new-notificacion', function (res) {
        var notificacion = res.data;

            var nNotificaciones = Number($("#nNotificacionesSpan").text()); // nNotificaciones to number
            if (nNotificaciones == NaN || nNotificaciones == undefined || nNotificaciones == null) { // if error
                nNotificaciones = 0;
            }

            // Notifications
            if (nNotificaciones > 0) {
                $("#nNotificacionesSpan").text(nNotificaciones + 1); // update nNotificaciones
            } else {
                $("#nNotificacionesSpan").text('1'); // update nNotificaciones
            }
            $("#notificaciones-container").prepend(createNotificacion(notificacion)); // add notification
            if (notificacion?.titulo != 'Nueva vacante!') {
            obtenerToast(notificacion?.titulo, 'nil', 2000, 'top-end').fire({})
            }
    });

    // Listen status connection
    socket.on('connect', function () {
        $('#alert_connection').hide();
        $('#statusCon').removeClass('text-danger');
        $('#statusCon').addClass('text-success');
        let idUsuario = $("#_idUsuario").attr("name");
        let rolUsuario = $("#_rolUsuario").attr("name");
        //socket.join([idUsuario, rolUsuario]);
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

    if (new URLSearchParams(window.location.search).has('limitNotificaciones')) {
        $('#dropdown-notificaciones').trigger('click');
    }

    // onsubmit modal
    $("#cambioPassword-form").submit(function (event) {

        event.preventDefault();
        if ($('#inputPassword').val() !== '' && PasswordStrength.test('', $('#inputPassword').val()).score <= 35) {
            return obtenerAlertSwal('Por favor mejore la seguridad de su contraseña!!', 'Datos inválidos!!', 'warning');
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
                    obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
                }
            }

        };
        xhr.open('PUT', '/usuario/actualizar', true);

        xhr.send(formData);
    });
});

function obtenerCV(usuario) {
    // show alert loading
    getLoading("Loading..", "Por favor espere.");
    // submit data
    const xhr = new XMLHttpRequest();


    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
            if (xhr.status === 201 || xhr.status === 200) {
                obtenerAlertSwal('Se ha obtenido con éxito su CV')
                    .then(() => window.open(JSON.parse(xhr.responseText).url, '_blank'))
            } else {
                obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
            }
        }

    };
    xhr.open('GET', '/pdf?idUsuario=' + usuario, true);

    xhr.send();
}

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
                obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
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
    } else {
        audioInformacionError.play();
    }
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'Aceptar',
        showLoaderOnConfirm: true
    })
}

function obtenerToast(titulo = 'General Title', redirectTo = '-', time = 1500, posicion = 'center') {
    audioInformacionSuccess.play();
    return Swal.mixin({ // create toast
        toast: true,
        icon: 'success',
        title: titulo,
        animation: false,
        position: posicion,
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        willClose: () => {
            if (redirectTo !== 'nil') {
            if (redirectTo == '-') {
          window.location.reload()
            } else {
                window.location.href = redirectTo
            }
        }
        }
      }).fire({})
    
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
function createNotificacion(notificacion) {
    let icon = "";
    let titulo = notificacion.titulo;
    if (notificacion.titulo == "Recuperación de contraseña") {
        icon = `<div class="icon-circle bg-warning">
                    <i class="fas fa-exclamation-triangle text-white"></i>
                </div>`;
    } else if (notificacion?.de) {
        titulo += `- <b>"${notificacion.de.nombre}"</b>`;
        icon = `<div class="icon-circle bg-info">
                    <i class="fas fa-info-circle text-white"></i>
                </div>`;
    } else {
        icon =`<div class="icon-circle bg-success">
                <i class="fas fa-check-double text-white"></i>
            </div>`;
    }
        return `<a class="dropdown-item d-flex align-items-center" href="#">
        <div class="mr-3">
            ${icon}
        </div>
        <div>
            <div class="small text-primary"><b>${titulo}</b></div>
            <span class="text-info"><b>${notificacion.mensaje}</b></span>
            <br>
            <span class="text-gray-500">${notificacion.fechaNotificacion}</span>

        </div>
    </a>`;
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
                    success: function () {
                        obtenerAlertSwal(`Cuenta eliminada correctamente!`, 'Cuenta eliminada!')
                            .then(() => $(`#${userId}-field`).remove())
                    },
                    error: function (errResp) {
                        obtenerAlertSwal(`A ocurrido un error.\n ${errResp.responseText}`, 'Error!', 'error')
                    }
                });

            }
        })
}



// delete user
function contactarSoporte() {
    let mensaje = '';
                    return Swal.fire({
                        title: '¿En que lo podemos ayudar?',
                        input: 'text',
                        inputAttributes: {
                          autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Look up',
                        showLoaderOnConfirm: true,
                        preConfirm: (msg) => {
                            mensaje = msg
                        },
                        allowOutsideClick: () => !Swal.isLoading()
                      }).then((result) => {
                        if (result.isConfirmed) {
                          enviarEmail(result.value)
                        }
                      })    
}


function enviarEmail(msg) {
    // Show loading
    getLoading('Enviando información..', 'Por favor espere....');

    // put data (create user)
    const formData = new FormData();
    const xhr = new XMLHttpRequest();

    formData.append('msg', msg);
    xhr.onreadystatechange = () => {

        if (xhr.readyState === 4) {
            if (xhr.status === 201 || xhr.status === 200) {
                obtenerAlertSwal('Se ha enviado su mensaje con éxito.')
            } else {
                obtenerAlertSwal(`A ocurrido un error.\n ${xhr.response}`, 'Error!', 'error')
            }
        }

    };
    xhr.open('POST', '/usuario/email/soporte/ayuda', true);

    xhr.send(formData);
}