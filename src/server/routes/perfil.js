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

// Tipo de registro empresarial route
app.get('/empresarial/:indice', (req, res) => {
    let indice = req.params.indice;
    res.render('mi_perfil_empresarial', {
        nombre: 'Farmacias Guadalajara',
        razon_social: 'FRAGUA SA de CV',
        foto: 'https://www.yo-local.com/sites/default/files/imagen_negocio/1_150.jpg',
        descripcion: 'Empresa de procesado de medicamentos.',
        direccion: 'Calle villa de Tezontepec',

        page: 'Mi Perfil Empresarial',
        nombre_boton_navbar: 'Mi Perfil Empresarial',
        direccion_link_boton_navbar: '/',
        no_pagina: indice,
        paginas: 4,
        solicitudes: 20,
        
        solicitantes: [
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23'}
        ]
    })
});


// Verificación de perfil route
app.get('/verificacion_cuenta', (req, res) => {
    res.render('verificacion_cuenta', {
        page: 'Verificar cuenta',
        nombre_boton_navbar: 'Verificación de Cuenta',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: '/perfil',

        empresa: {
            rfc: '123456789123',
            nombre_contacto: 'Juan Perez',
            telefono: '55213445455',
            razon_social: 'Fragua SA de CV',
            cargo_contacto: 'Lider de proyecto',
            nombre: 'Cedis Centro de Farmacias guadalajara',
            sector: 'privado',
            ubicacion: '12345678,21345678',
            correo: 'contacto@gmail.com'
        }
    })
});

// Verificación de perfil en proceso route
app.get('/verificacion_cuenta_en_proceso', (req, res) => {
    res.render('verificacion_cuenta_en_proceso', {
        page: 'Verificar cuenta',
        nombre_boton_navbar: 'Verificación de Cuenta',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: '/perfil'
    })
});

module.exports = app;