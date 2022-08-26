const express = require('express'); // express module
const app = express(); // aplication
const fileUpload = require('express-fileupload');

const { Usuario } = require('../classes/usuario'); // Usuario class
const { Vacante } = require('../classes/vacante'); // Vacante class
const { Email } = require('../classes/mailer'); // Vacante class
const { Postulacion } = require('../classes/postulacion'); // Vacante class
const { checkSession, checkEnterpriseRole, checkAdminRole, checkSuperRole  } = require('../middlewares/auth');
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

// ==========================
// Actualizar postulacion
// ==========================
app.put('/actualizar/reclutar/:postulacionId/:status', [checkSession, checkEnterpriseRole], async(req, res) => {
    await Postulacion.actualizar(req.params.postulacionId, {'status': req.params.status})
    .then((dbPostulation) => {
        Email.send(email = dbPostulation.usuario.email, title='Ha sido reclutado!', text=`Ha sido reclutado para la vacante: '${dbPostulation.vacante.puesto}' de la empresa: '${dbPostulation.vacante.empresa.nombre}'`)
        .then(() => {
            console.log('Email sent');
        }).catch(err => {
            console.log(err);
        });
        return res.status(200).json({});
    })
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
});



module.exports = app;