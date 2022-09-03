const express = require('express'); // express module
const path = require('path');
const fs = require('fs');
const app = express(); // aplication

const { Usuario } = require('../classes/usuario'); // Usuario class
const { Vacante } = require('../classes/vacante'); // Vacante class
const { Postulacion } = require('../classes/postulacion'); // Vacante class
const { Notificacion } = require('../classes/notificacion'); // Vacante class
const { checkSession, checkAdminRole, checkSuperRole, checkEnterpriseRole  } = require('../middlewares/auth');
const base64ArrayBuffer = require('base64-arraybuffer');
const { storage, ref, getBytes} = require('../config/firebaseConfig')
const { getFile, existeFile, getFileRef} = require('../config/firebaseConfig')

const { Email } = require('../classes/mailer'); // user class
// Tipo de registro route

app.get('/', checkSession, async(req, res) => {
    const idUsuario = req.session.usuario._id;
    const limitNotificaciones = req.query.limitNotificaciones || 10;
        await Promise.all([
        Usuario.findById(idUsuario),
        Vacante.encontrarTodas(),
        Usuario.buscaTodasLasEmpresas(),
        Postulacion.buscarTodasLasPostulacionesPorUsuario(idUsuario),
        Notificacion.buscarPorUsuario(req.session.usuario, limitNotificaciones),
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
            RFC_Exist: await existeFile('RFC', idUsuario, '.pdf').then((res)=> res[0]),
                 RFC: await getFile('RFC', idUsuario, '.pdf').then(resURL=> { return resURL}),
                 INE_Exist: await existeFile('INE', idUsuario, '.pdf').then((res)=> res[0]),
                 INE: await getFile('INE', idUsuario, '.pdf').then(resURL=> { return resURL}),
                 comprobantesDomicilio_EXIST: await existeFile('comprobantesDomicilio', idUsuario, '.pdf').then((res)=> res[0]),
                 comprobantesDomicilio: await getFile('comprobantesDomicilio', idUsuario, '.pdf').then(resURL=> { return resURL}),
                 CartaCompromiso_EXIST: await existeFile('CartaCompromiso', idUsuario, '.pdf').then((res)=> res[0]),
                 CartaCompromiso: await getFile('CartaCompromiso', idUsuario, '.pdf').then(resURL=> { return resURL}),

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
            notificaciones:  await Notificacion.buscarPorUsuario(req.session.usuario, 10)
            .then(resp =>{return { data: resp.data, total: resp.total}}),
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

        page: 'Mi Perfil Empleador',
        nombre_boton_navbar: 'Mi Perfil Empleador',
        
        solicitantes: await Postulacion.buscarTodasLasPostulacionesPorEmpresa(req.session.usuario._id)
        .then(resp =>{return { data: resp.data, total: resp.total}})
            .catch(() => {}),
            notificaciones:  await Notificacion.buscarPorUsuario(req.session.usuario, 10)
            .then(resp =>{return { data: resp.data, total: resp.total}}),
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
            notificaciones:  await Notificacion.buscarPorUsuario(req.session.usuario, 10)
            .then(resp =>{return { data: resp.data, total: resp.total}}),
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
app.get('/verificacion_cuenta', checkSession, async(req, resp) => {
    let usuarioId = req.session.usuario._id;
    let nombreBoton = 'Verificación de Cuenta';
    if (req.session.usuario.perfilVerificado == 'Verificado') {
        nombreBoton = 'Actualización de datos';
    }
    resp.render('verificacion_cuenta', {
        page: 'Verificar cuenta',
        nombre_boton_navbar: nombreBoton,
        mostrar_boton_regreso: true,
        direccion_link_boton_navbar: '/perfil/empresarial/1',

        fechaModificacionRFC:  await existeFile('RFC', usuarioId, '.pdf').then(response => {
                if (response[0]) {
                    return true
                }
        }),
        fechaModificacionComprobante: await existeFile('comprobantesDomicilio', usuarioId, '.pdf').then(response => {
            if (response[0]) {
                return true
            }
    }),
        fechaModificacionINE: await existeFile('INE', usuarioId, '.pdf').then(response => {
            if (response[0]) {
                return true
            }
    }),
    fechaModificacionCartaCompromiso: await existeFile('CartaCompromiso', usuarioId, '.pdf').then(response => {
        if (response[0]) {
            return true
        }
}),
        empresa: await Usuario.findById(usuarioId)
        .then(respuesta => respuesta.data)
        .catch(err => resp.status(err.code).json({ msg: err.msg, err: err.err })),

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