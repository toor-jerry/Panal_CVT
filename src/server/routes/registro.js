const express = require('express'); // express module
const app = express(); // aplication

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
        direccion_link_boton_navbar: 'tipo_registro'
    })
});

// Tipo de registro route
app.get('/registro_cuenta_empresarial', (req, res) => {
    res.render('registro_cuenta_empresarial', {
        page: 'Registro de Cuenta',
        nombre_boton_navbar: 'Registro de Cuenta (Perfil Empresarial)',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: 'tipo_registro'
    })
});

// Personalización de perfil route
app.get('/personalizacion_de_perfil', (req, res) => {
    res.render('personalizacion_de_perfil', {
        page: 'Personalización de perfil',
        nombre_boton_navbar: 'Personalización de Perfil',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: 'registro_cuenta_personal'
    })
});


module.exports = app;