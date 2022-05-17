const express = require('express'); // express module
const app = express(); // aplication

// Tipo de registro route
app.get('/', (req, res) => {
    res.render('mi_perfil', {
        page: 'Mi Perfil',
        nombre_boton_navbar: 'Mi Perfil',
        direccion_link_boton_navbar: '/',
        edad: 23,
        sexo: 'Hombre',
        progreso: 'Egresado',
        nickname: '@Gerardss',
        nombre: 'Gerardo Bautista Castañeda',
        descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.',

        vacantes: [
            {nombre_empresa: 'Farmacias Guadalajara', foto_empresa: 'https://www.yo-local.com/sites/default/files/imagen_negocio/1_150.jpg', descripcion_vacante: 'Se solicita desarrollador de IOS para la creación de aplicaciones IOS.'},
            {nombre_empresa: 'Grupo Salinas', foto_empresa: 'https://indicepolitico.com/wp-content/uploads/2019/10/gruposalinas-foto_cortesia_internet.jpg', descripcion_vacante: 'Se solicita desarrollador de Android para la creación de aplicaciones Android.'}
        ]
    })
});


module.exports = app;