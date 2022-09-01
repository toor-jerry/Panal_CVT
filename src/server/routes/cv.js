const express = require('express'); // express module
const app = express(); // aplication

const { Usuario } = require('../classes/usuario'); // Vacante class
const { checkSession, checkAdminRole, checkSuperRole, checkEnterpriseRole  } = require('../middlewares/auth');
const { storage, ref, getBytes} = require('../config/firebaseConfig')
const base64ArrayBuffer = require('base64-arraybuffer');
const { Notificacion } = require('../classes/notificacion'); // Vacante class

// Tipo de registro route
app.get('/', checkSession, async(req, res) => {
    let foto;
    const fotografiasRef = ref(storage, 'fotografias/' + req.session.usuario._id + '.img');
                   await getBytes(fotografiasRef)
                    .then(val => {
                        foto =  base64ArrayBuffer.encode(val)
                    })
                    .catch(err => console.log('No se encuentra la imagen'))
    res.render('mi_cv', {
        page: 'Mi Curriculum',
        nombre_boton_navbar: 'Mi Curriculum',
        direccion_link_boton_navbar: '/perfil',
        mostrar_boton_guardar: true,
        mostrar_boton_regreso: true,
        foto: foto,
        notificaciones: await Notificacion.buscarPorUsuario(req.session.usuario, 10),

        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(() => {}),


        archivoJS: 'function_actualizar_cv.js',
    })
});


module.exports = app;