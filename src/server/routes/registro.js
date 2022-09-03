const express = require('express'); // express module
const app = express(); // aplication

const { checkSession, checkAdminRole } = require('../middlewares/auth'); // midlewares auth
const { Usuario } = require('../classes/usuario'); // user class
const { storage, ref, getBytes} = require('../config/firebaseConfig')
const base64ArrayBuffer = require('base64-arraybuffer');

// Tipo de registro route
app.get('/tipo_registro', (req, res) => {
    res.render('tipo_registro', {
        page: 'Tipo de registro',
        nombre_boton_navbar: 'Selecciona el tipo de Registro',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: '/'
    })
});

// Tipo de registro route
app.get('/registro_cuenta_personal', (req, res) => {
    res.render('registro_cuenta_personal', {
        page: 'Registro de Cuenta',
        nombre_boton_navbar: 'Registro de Cuenta (Perfil Personal)',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: 'tipo_registro',
        archivoJS: 'function_form_creacion_cuenta_personal.js'
    })
});

// Tipo de registro route
app.get('/registro_cuenta_empresarial', (req, res) => {
    res.render('registro_cuenta_empresarial', {
        page: 'Registro de Cuenta',
        nombre_boton_navbar: 'Registro de Cuenta (Perfil Empleador)',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: 'tipo_registro',
        archivoJS: 'function_form_creacion_cuenta_empresarial.js'
    })
});

// Personalización de perfil route
app.get('/personalizacion_de_perfil', checkSession, async(req, res) => {
    console.log(req.session.usuario);
    let foto;
    const fotografiasRef = ref(storage, 'fotografias/' + req.session.usuario._id + '.img');
                   await getBytes(fotografiasRef)
                    .then(val => {
                        foto =  base64ArrayBuffer.encode(val)
                    })
                    .catch(err => console.log("err"))
                    .finally(() => {
                    res.render('personalizacion_de_perfil', {
                        page: 'Personalización de perfil',
                        nombre_boton_navbar: 'Personalización de Perfil',
                        usuario: req.session.usuario,
                        foto: foto,
                        archivoJS: 'function_personalizacion_perfil.js',
                    })
                })
});

// Personalización de perfil route
app.get('/nuevo-usuario', [checkSession, checkAdminRole], async(req, res) => {
    res.render('nuevo_usuario', {
        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(() => {}),

        page: 'Mi Perfil Sistemas',
        nombre_boton_navbar: 'Mi Perfil Sistemas',
        direccion_link_boton_navbar: '/perfil/sistemas',
        mostrar_boton_regreso: true,
        archivoJS: 'function_crear_usuario.js'
    })
});


module.exports = app;