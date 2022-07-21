const express = require('express'); // express module
const app = express(); // aplication

const { Usuario } = require('../classes/usuario'); // Usuario class
const { Vacante } = require('../classes/vacante'); // Vacante class
const { checkSession, checkAdminRole, checkSuperRole, checkEnterpriseRole  } = require('../middlewares/auth');


// Tipo de registro route
app.get('/:id_empresa/:nombre_empresa', checkSession, async(req, res) => {
    let nombre_empresa = req.params.nombre_empresa;
    res.render('postulacion', {
        page: 'Postulacion - ' + nombre_empresa,
        nombre_boton_navbar: 'Mi Perfil',


        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        vacante: {
            nombre_empresa,
            id_empresa: req.params.id_empresa
        },
        archivoJS: 'function_postulacion.js'
    })
});



module.exports = app;