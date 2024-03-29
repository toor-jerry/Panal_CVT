const express = require('express'); // express module
const app = express(); // aplication

const { Usuario } = require('../classes/usuario'); // Vacante class
const { checkSession, checkAdminRole, checkSuperRole, checkEnterpriseRole  } = require('../middlewares/auth');


// Tipo de registro route
app.get('/', checkSession, async(req, res) => {
    res.render('mi_cv', {
        page: 'Mi Curriculum',
        nombre_boton_navbar: 'Mi Curriculum',
        direccion_link_boton_navbar: '/perfil',
        mostrar_boton_guardar: true,
        mostrar_boton_regreso: true,

        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(() => {}),


        archivoJS: 'function_actualizar_cv.js',
    })
});


module.exports = app;