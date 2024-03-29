const express = require('express'); // express module
const path = require('path');
const fs = require('fs');
const app = express(); // aplication

const { Usuario } = require('../classes/usuario'); // Usuario class
const { Vacante } = require('../classes/vacante'); // Vacante class
const { Postulacion } = require('../classes/postulacion'); // Vacante class
const { Notificacion } = require('../classes/notificacion'); // Vacante class
const { checkSession, checkAdminRole, checkSuperRole, checkEnterpriseRole  } = require('../middlewares/auth');

// Tipo de registro route
app.get('/', checkSession, (req, res) => {
    const idUsuario = req.session.usuario._id;
    const limitNotificaciones = req.query.limitNotificaciones || 10;
    Promise.all([
        Usuario.findById(idUsuario),
        Vacante.encontrarTodas(),
        Usuario.buscaTodasLasEmpresas(),
        Postulacion.buscarTodasLasPostulacionesPorUsuario(idUsuario),
        Notificacion.buscarPorUsuario(idUsuario, limitNotificaciones)
    ])
    .then(responses =>{
        res.render('mi_perfil', {
            page: 'Mi Perfil',
            nombre_boton_navbar: 'Mi Perfil',
            direccion_link_boton_navbar: '/',
            mostrarInformacionUsuario: true,

                usuario: responses[0].data,
            vacantes: { data: responses[1].data, total: responses[1].total },
            convenios:{ data: responses[2].data, total: responses[2].total },
            postulaciones: { data: responses[3].data, total: responses[3].total },
            notificaciones: { data: responses[4].data, total: responses[4].total },

            archivoJS: 'function_perfil.js'})
}).catch(err => res.status(500).json(err))
    
});

// Tipo de registro route
app.get('/informacion/:idUsuario', checkSession, async(req, res) => {
    let idUsuario = req.params.idUsuario;

    let rutaRegreso = '/';

    if (req.session.usuario.userRole === 'USER_ADMIN') {
        rutaRegreso = '/perfil/administrativo/1/1';
    } else if (req.session.usuario.userRole === 'USER_ENTERPRISE') {
        rutaRegreso = '/perfil/empresarial/1';
    } else if (req.session.usuario.userRole === 'SUPER_USER') {
        rutaRegreso = '/perfil/sistemas';
    } else {
        rutaRegreso = '/perfil';
    }

    res.render('informacion_usuario', {
        page: 'Mi Perfil',
        nombre_boton_navbar: 'Información de empresa',
        direccion_link_boton_navbar: rutaRegreso,
        mostrarInformacionUsuario: true,
        mostrar_boton_regreso: true,

        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

            informacionUsuario: await Usuario.findById(idUsuario)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        convenios: await Usuario.buscaTodasLasEmpresas()
        .then(resp =>{return { data: resp.data, total: resp.total}})
        .catch(() => {}),

        archivoJS: 'function_perfil.js'
    })
});

// Tipo de registro empresarial route
app.get('/sistemas', [checkSession, checkSuperRole], async(req, res) => {
    let indice = req.params.indice;
    res.render('mi_perfil_sistemas', {
        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(() => {}),

        page: 'Mi Perfil Sistemas',
        nombre_boton_navbar: 'Mi Perfil Sistemas',
        
        usuarios: await Usuario.findAll()
        .then(resp =>resp.data)
            .catch(() => {}),

        archivoJS: 'function_perfil_sistemas.js'
    })
});

// Tipo de registro empresarial route
app.get('/empresarial/:indice', [checkSession, checkEnterpriseRole], async(req, res) => {
    let indice = req.params.indice;
    res.render('mi_perfil_empresarial', {
        mostrarInformacionUsuario: true,
        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(() => {}),

        page: 'Mi Perfil Empresarial',
        nombre_boton_navbar: 'Mi Perfil Empresarial',
        
        solicitantes: await Postulacion.buscarTodasLasPostulacionesPorEmpresa(req.session.usuario._id)
        .then(resp =>{return { data: resp.data, total: resp.total}})
            .catch(() => {}),

        archivoJS: 'function_perfil.js'
    })
});

// Tipo de perfil administrativo route
app.get('/administrativo/:indice_formularios/:indice_empresas', [checkSession, checkAdminRole], async(req, res) => {
    let no_pagina_formularios = req.params.indice_formularios;
    let no_pagina_empresas = req.params.indice_empresas;
    res.render('mi_perfil_administrativo', {
        usuario: req.session.usuario,
        
        page: 'Universidad Administrativo',
        nombre_boton_navbar: 'Universidad Administrativo',
        mostrarInformacionUsuario: true,
        
        no_pagina_formularios,
        no_pagina_empresas,

        solicitantes: await Usuario.buscaEstudiantes(no_pagina_formularios, 10)
        .then(resp =>{return { data: resp.data, total: resp.total, paginas: resp.paginas}})
            .catch(() => {}),
            
        empresas:  await Usuario.buscaEmpresas(no_pagina_empresas, 10)
            .then(resp =>{return { data: resp.data, total: resp.total, paginas: resp.paginas}})
            .catch(() => {}),

        archivoJS: 'function_perfil_administrativo.js'
    })
});
function obtenerFechaUltimaModificacionArchivo(carpeta, idUsuario) {
    let fechaArchivo;
    const pathArchivo = path.resolve(__dirname, `../../../uploads/${carpeta}/${idUsuario}.pdf`);
    
    if (fs.existsSync(pathArchivo)) {
        fechaArchivo =  new Date(fs.statSync(pathArchivo).mtime).toLocaleString();
    }

    return fechaArchivo;
}

// Verificación de perfil route
app.get('/verificacion_cuenta', checkSession, async(req, res) => {
    let usuarioId = req.session.usuario._id;
    res.render('verificacion_cuenta', {
        page: 'Verificar cuenta',
        nombre_boton_navbar: 'Verificación de Cuenta',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: '/perfil/empresarial/1',

        fechaModificacionRFC: obtenerFechaUltimaModificacionArchivo("RFC", usuarioId),
        fechaModificacionComprobante: obtenerFechaUltimaModificacionArchivo("comprobantesDomicilio", usuarioId),
        fechaModificacionINE: obtenerFechaUltimaModificacionArchivo("INE", usuarioId),

        empresa: await Usuario.findById(usuarioId)
        .then(resp => resp.data)
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        archivoJS: 'function_verificacion_perfil.js'
    })
});

// Verificación de perfil en proceso route
app.get('/verificacion_cuenta_en_proceso', checkSession, (req, res) => {
    res.render('verificacion_cuenta_en_proceso', {
        page: 'Verificar cuenta',
        nombre_boton_navbar: 'Verificación de Cuenta',
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: '/perfil/empresarial/1'
    })
});

module.exports = app;