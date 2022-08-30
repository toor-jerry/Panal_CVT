const express = require('express'); // express module
const path = require('path');
const fs = require('fs');
const app = express(); // aplication
const fileUpload = require('express-fileupload');
const { Usuario } = require('../classes/usuario'); // Usuario class
const { Postulacion } = require('../classes/postulacion'); // Vacante class
const { Vacante } = require('../classes/vacante'); // Vacante class
const { Notificacion } = require('../classes/notificacion'); // user class

const { checkSession, checkEnterpriseRole, checkEstatusVerificacion } = require('../middlewares/auth');
const base64ArrayBuffer = require('base64-arraybuffer');
const { storage, ref, getBytes } = require('../config/firebaseConfig')
const { getFile, existeFile } = require('../config/firebaseConfig')
const { io } = require('../app');

app.use(fileUpload());
// Creación vacante
app.get('/form/creacion', [checkSession, checkEnterpriseRole, checkEstatusVerificacion], async (req, res) => {
    
    res.status(200).render('form_creacion_vacante', {
        page: 'Creación',
        nombre_boton_navbar: 'Creación de Vacante',
        mostrarInformacionUsuario: true,

        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        vacantes: await Vacante.encontrarPorEmpresa(req.session.usuario._id)
            .then(resp => { return { data: resp.data, total: resp.total } })
            .catch(() => { }),

        empresas: await Usuario.buscaTodasLasEmpresas()
            .then(resp => { return { data: resp.data, total: resp.total } })
            .catch(() => { }),


        archivoJS: 'function_form_creacion_vacante.js'
    })
});

// ==========================
// Buscar vacantes
// ==========================
app.get('/buscar/:terminoBusqueda', checkSession, async (req, res) => {

    const search = req.params.terminoBusqueda;
    let regex;
    try {
        regex = new RegExp(search.trim(), 'i');
    } catch (err) {
        return response400(res, 'Bad request.', err.toString());
    }
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;

    res.render('mi_perfil', {
        page: 'Mi Perfil',
        nombre_boton_navbar: 'Mi Perfil',
        direccion_link_boton_navbar: '/',
        terminoBusqueda: search,
        mostrarInformacionUsuario: true,



        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        vacantes: await Vacante.buscarVacantes(regex, from, limit)
            .then(resp => { return { data: resp.data, total: resp.total } })
            .catch(() => { }),

        convenios: await Usuario.buscaTodasLasEmpresas()
            .then(resp => { return { data: resp.data, total: resp.total } })
            .catch(() => { }),
        postulaciones: await Postulacion.buscarTodasLasPostulacionesPorUsuario(req.session.usuario._id)
            .then(resp => { return { data: resp.data, total: resp.total } })
            .catch(() => { }),

        archivoJS: 'function_perfil.js'
    })
});

// ==========================
// Eliminar una vacante por ID 
// ==========================
app.delete('/:vacante/:empresaID', [checkSession, checkEnterpriseRole], async (req, res) =>
    await Vacante.eliminar(req.params.vacante, req.params.empresaID)
        .then(resp => {

            Notificacion.crear({ titulo: 'Vacante eliminada!', mensaje: 'Se ha eliminado la vacante: "' + resp.data.puesto + '"' })
                .then(respNotif => {
                    io.emit('new-notificacion', { data: respNotif.data })
                })
                .catch((err) => {
                    console.log(err);
                });
            res.status(200).json({});
        })
        .catch(() => { }));

// Tipo de registro route (postulacion a vacante)
app.get('/:id', checkSession, async (req, res) => {
    let idVacante = req.params.id;
    let idUsuario = req.session.usuario._id;
    //let fechaModificacionCV = null;
    let cvPersonal = false;

    res.render('informacion_vacante', {
        page: 'Postulacion',
        nombre_boton_navbar: 'Información de la vacante',
        direccion_link_boton_navbar: '/perfil',
        mostrar_boton_regreso: true,
        cvPersonal: cvPersonal,
        //fechaModificacionCV: fechaModificacionCV,

        vacante: await Vacante.buscarPorId(idVacante)
            .then(resp => { return resp.data })
            .catch(() => { }),

        archivoJS: 'function_registro_vacante.js'
    })
});

// ==========================
// Crear una vacante (empleo) 
// ==========================
app.post('/', [checkSession, checkEnterpriseRole], (req, res) => {
    let body = req.body;
    body.empresa = req.query.empresaId || req.session.usuario._id;
    // Se está creando desde un perfil diferente del de la empresa
    if (req.query.empresaId) {
        body.perfilCreacion = req.session.usuario._id;
    }
    Vacante.crear(body)
        .then(resp => {
            res.status(201).json({});
            Notificacion.crear({ titulo: 'Nueva vacante!', mensaje: 'Se ha creado una nueva vacante titulada: "' + resp.data.puesto + '"' })
                .then(respNotif => {
                    io.emit('new-notificacion', { data: respNotif.data })
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch(err => { res.status(err.code).json(err.err) });
});

module.exports = app;