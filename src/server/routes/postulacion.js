const express = require('express'); // express module
const app = express(); // aplication
const fileUpload = require('express-fileupload');

const { Usuario } = require('../classes/usuario'); // Usuario class
const { Vacante } = require('../classes/vacante'); // Vacante class
const { Postulacion } = require('../classes/postulacion'); // Vacante class
const { checkSession, checkAdminRole, checkSuperRole, checkEnterpriseRole  } = require('../middlewares/auth');
const JSONTransport = require('nodemailer/lib/json-transport');
app.use(fileUpload());


// Tipo de registro route
app.get('/:idVacante/:nombre_empresa', checkSession, async(req, res) => {
    let nombre_empresa = req.params.nombre_empresa;
    res.render('postulacion', {
        page: 'Postulacion - ' + nombre_empresa,
        nombre_boton_navbar: 'Mi Perfil',
        mostrarInformacionUsuario: true,


        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        vacante: {
            nombre_empresa,
            idVacante: req.params.idVacante
        },
        archivoJS: 'function_postulacion.js'
    })
});

// ==========================
// Crear una postulación
// ==========================
app.post('/', checkSession, (req, res) =>{
    Postulacion.crear({
        vacante: req.body.vacante,
        usuario: req.session.usuario._id,
        empresa: req.body.empresa
    }).then(resp => res.status(200).json({
        ok: true,
        data: resp.data
    }))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
});



module.exports = app;