$(document).ready(function() {

    var remember = false; // remember default (check)

    /***************************
     * load localstorage
     ***************************/

    // if remember exist
    if (localStorage.getItem('remember')) {
        $('#rememberCheck').attr('checked', true);
        remember = true;
    }

    // if email exist
    if (localStorage.getItem('email')) {
        $('#inputEmail').val(localStorage.getItem('email'));
    }

    // rememberCheck (event)
    $('#rememberCheck').click(function() {

        remember = !remember; // change remember variable

        if (remember) {
            saveStorage();
        } else {
            deleteStorage();
        }
    });

    // onsubmit login form
    $("#login-form").submit(function(event) {

        event.preventDefault();

        // show alert loading
        getLoading("Verificando su identidad...", "Loading..", );

        // submit data
        $.post("/user/login", getDataUserLogin(), function() {})
            .done(function(res) {

                if (remember) {
                    saveStorage();
                }

                var toastLogin = Swal.mixin({ // create toast
                    toast: true,
                    icon: 'success',
                    title: 'General Title',
                    animation: false,
                    position: 'center',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true
                });

                toastLogin.fire({
                        animation: true,
                        title: `Bienvenid@ ${res.data.name}!!`
                    })
                    .then(() => location.href = "/dashboard")
            })
            .fail(function(errResp) {
                showError(errResp); // show error alert
            });
    });

});