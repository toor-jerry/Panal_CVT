var socket = io(); // initialization sockets

$(document).ready(function() {
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

    $("#hombre").change(function() {
        genero = "Hombre"
    });

    $("#mujer").change(function() {
        genero = "Mujer"
    });

    // Al seleccionar la foto
    $("#inputFoto").change(function() {
        leerImagen(this);
    });
    
    });

    function obtenerAlertSwal(text = 'Se guardado su información.', title = 'Actualización exitosa!', icon='success') {
        return swal.fire({
            title: title,
            text: text,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true
        });
    }

function obtenerToast(time = 1000) {
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

var audio = new Audio('/audio/new-cite.mp3');

$('#alert_connection').hide(); // hide alert "No connection"

function leerImagen(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        const tipo = /image.*/
        if (!input.files[0].type.match(tipo)){
            swal.fire({
                title: 'Advertencia',
                text: `Seleccione imágenes.`,
                icon: 'info',
                showLoaderOnConfirm: true
            });
            return
        }
        
        imagen = input.files[0];
        reader.onload = function(e) {
            $("#img-previo").attr("src", e.target.result); // Se renderiza la imagen
    }
    reader.readAsDataURL(input.files[0]);
}
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


// return loading
function getLoading(title, txt = "Loading...") {
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


