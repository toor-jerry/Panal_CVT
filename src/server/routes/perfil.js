const express = require('express'); // express module
const app = express(); // aplication

const { Usuario } = require('../classes/usuario'); // Usuario class
const { Vacante } = require('../classes/vacante'); // Vacante class
const { checkSession, checkAdminRole, checkSuperRole, checkEnterpriseRole  } = require('../middlewares/auth');

// Tipo de registro route
app.get('/', checkSession, async(req, res) => {
    res.render('mi_perfil', {
        page: 'Mi Perfil',
        nombre_boton_navbar: 'Mi Perfil',
        direccion_link_boton_navbar: '/',

        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        vacantes: await Vacante.encontrarTodas()
            .then(resp =>{return { data: resp.data, total: resp.total }})
            .catch(() => {}),

        archivoJS: 'function_perfil.js'
    })
});

// Tipo de registro empresarial route
app.get('/empresarial/:indice', [checkSession, checkEnterpriseRole], async(req, res) => {
    let indice = req.params.indice;
    res.render('mi_perfil_empresarial', {
        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(() => {}),

        page: 'Mi Perfil Empresarial',
        nombre_boton_navbar: 'Mi Perfil Empresarial',
        direccion_link_boton_navbar: '/',
        no_pagina: indice,
        paginas: 4,
        solicitudes: 20,
        
        solicitantes: [
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
        ],
        archivoJS: 'function_perfil.js'
    })
});

// Tipo de perfil administrativo route
app.get('/administrativo/:indice_formularios/:indice_empresas', [checkSession, checkAdminRole], async(req, res) => {
    let no_pagina_formularios = req.params.indice_formularios;
    let no_pagina_empresas = req.params.indice_empresas;
    res.render('mi_perfil_administrativo', {

        page: 'Universidad Administrativo',
        nombre_boton_navbar: 'Universidad Administrativo',
        paginas_formularios: 4,
        registros_solicitantes: 20,
        
        paginas_empresas: 4,
        registros_empresas: 20,
        
        no_pagina_formularios,
        no_pagina_empresas,

        solicitantes: [
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            {nombre: 'Gerardo Bautista Castañeda', foto: 'https://concepto.de/wp-content/uploads/2018/08/persona-e1533759204552.jpg', titulo: 'Desarrollador IOS',carrera: 'Licenciatura en Informática Administrativa', sexo: 'Hombre', edad: '23', progreso: 'Egresado', descripcion: 'Egresado de la licenciatura en derecho, bilingue, me gusta el deporte, leer, salir a lugares nueos.'},
            ],
            
        empresas:  await Usuario.buscaEmpresas()
            .then(resp =>{return { data: resp.data, total: resp.total, paginas: resp.paginas }})
            .catch(() => {}),

        archivoJS: 'function_perfil.js'
    })
});


// Verificación de perfil route
app.get('/verificacion_cuenta', [checkSession, checkAdminRole],(req, res) => {
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
app.get('/verificacion_cuenta_en_proceso', [checkSession, checkAdminRole], (req, res) => {
    res.render('verificacion_cuenta_en_proceso', {
        page: 'Verificar cuenta',
        nombre_boton_navbar: 'Verificación de Cuenta',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: '/perfil'
    })
});

module.exports = app;