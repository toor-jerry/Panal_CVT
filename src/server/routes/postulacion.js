const express = require('express'); // express module
const app = express(); // aplication

// Tipo de registro route
app.get('/:id_empresa/:nombre_empresa', (req, res) => {
    let nombre_empresa = req.params.nombre_empresa;
    res.render('postulacion', {
        page: 'Postulacion - ' + nombre_empresa,
        nombre_boton_navbar: 'Mi Perfil',
        direccion_link_boton_navbar: '/',
        edad: 23,
        sexo: 'Hombre',
        progreso: 'Egresado',
        nickname: '@Gerardss',
        nombre: 'Gerardo Bautista Castañeda',
        descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.',
        usuario: {
            nombre: 'Gerardo',
            matricula: '135078',
            apellidos: 'Bautista Castañeda',
            licenciatura: 'Licenciatura en Informática Administrativa',
            contacto: '5521489735',
            correo: 'gbautisa@uaemex.com',
            domicilio: 'Calle 24 de Febrero S/N, San Antonio Coayuca',
            anio_egreso: '2020',
            titulo: 'SI',
            cedula: 'TRAMITE'
        },
        vacante: {
            nombre_empresa
        }
    })
});



module.exports = app;