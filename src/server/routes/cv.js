const express = require('express'); // express module
const app = express(); // aplication

// Tipo de registro route
app.get('/', (req, res) => {
    res.render('mi_cv', {
        page: 'Mi Curriculum',
        nombre_boton_navbar: 'Mi Curriculum',
        direccion_link_boton_navbar: '/perfil',
        nombre: 'Gerardo Bautista Castañeda',
        exp_laboral: '',
        empleos: [ { nombre_empresa: 'Farmacias Guadalajara', puesto: 'Supervisor', anio: '2021 - 2022', funciones: 'Supervisar área de surtido' }, { nombre_empresa: 'ONKAN', puesto: 'Desarrollador', anio: '2022 - 2023', funciones: 'Desarrollador Back-end en PHP' } ],
        estudios: [ { nombre_escuela: 'UAEMEX', nivel_academico: '1', periodo: '2010-2011' } ],
        habilidades: {_1: 'Programar', _2: 'Manejo de personal', _3: 'Manejo de Linux'},
        logros: {_1: 'Desarrollador Jr', _2: 'Supervisor Jr', _3: 'Aprendizaje de IOS'},
        correo_institucional: 'gbautistac348',
        numero_cel: '5521489735'
    })
});


module.exports = app;