const express = require('express'); // express module
const path = require('path');
const fs = require('fs');
const app = express(); // aplication

const { Usuario } = require('../classes/usuario'); // Usuario class
const { Postulacion } = require('../classes/postulacion'); // Vacante class
const { Vacante } = require('../classes/vacante'); // Vacante class

const { checkSession, checkEnterpriseRole, checkEstatusVerificacion } = require('../middlewares/auth');

const { io } = require('../app');
const JSONTransport = require('nodemailer/lib/json-transport');


// Creación vacante
app.get('/form/creacion', [checkSession, checkEnterpriseRole, checkEstatusVerificacion], async(req, res) => {

    res.status(200).render('form_creacion_vacante', {
        page: 'Creación',
        nombre_boton_navbar: 'Creación de Vacante',

        usuario: await Usuario.findById(req.session.usuario._id)
        .then(resp => resp.data)
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),
        
        vacantes: await Vacante.encontrarPorEmpresa(req.session.usuario._id)
            .then(resp =>{return { data: resp.data, total: resp.total }})
            .catch(() => {}),

            empresas: await Usuario.buscaTodasLasEmpresas()
        .then(resp =>{return { data: resp.data, total: resp.total}})
        .catch(() => {}),


            archivoJS: 'function_form_creacion_vacante.js'
        })
    });
    
// ==========================
// Buscar vacantes
// ==========================
app.get('/buscar/:terminoBusqueda', checkSession, async(req, res) => {

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

    

    usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        vacantes: await Vacante.buscarVacantes(regex, from, limit)
            .then(resp =>{ return { data: resp.data, total: resp.total }})
            .catch(() => {}),

        convenios: await Usuario.buscaTodasLasEmpresas()
        .then(resp =>{return { data: resp.data, total: resp.total }})
        .catch(() => {}),
        postulaciones: await Postulacion.buscarTodasLasPostulacionesPorUsuario(req.session.usuario._id)
            .then(resp => { return { data: resp.data, total: resp.total } })
            .catch(() => {}),

        archivoJS: 'function_perfil.js'
    })
});

// ==========================
// Eliminar una vacante por ID 
// ==========================
app.delete('/:vacante', [checkSession, checkEnterpriseRole], (req, res) => Vacante.eliminar(res, req.params.vacante, req.session.usuario._id));

// Tipo de registro route (postulacion a vacante)
app.get('/:id', checkSession, async(req, res) => {
    let idVacante = req.params.id;
    let idUsuario = req.session.usuario._id;
    let fechaModificacionCV = null;
    const pathArchivo = path.resolve(__dirname, `../../../uploads/cv/${idUsuario}.pdf`);
    let cvPersonal = false;
    
    if (fs.existsSync(pathArchivo)) {
        cvPersonal = true;
        fechaModificacionCV =  new Date(fs.statSync(pathArchivo).mtime).toLocaleString();
    }

    res.render('registro_vacante', {
        page: 'Postulacion',
        nombre_boton_navbar: 'Información de la vacante',
        direccion_link_boton_navbar: '/perfil',
        mostrar_boton_regreso: true,
        cvPersonal: cvPersonal,
        fechaModificacionCV: fechaModificacionCV,
        
        vacante: await Vacante.buscarPorId(idVacante)
            .then(resp => { return resp.data })
            .catch(() => {}),

        archivoJS: 'function_registro_vacante.js'
    })
});

// // ==========================
// // Get all employments no-auth
// // ==========================
// app.get('/no-auth', (req, res) => {

//     const from = Number(req.query.from) || 0;
//     const limit = Number(req.query.limit) || 10;
//     let params_populate = 'name';

//     Employment.findAll(res, params_populate, from, limit, false);

// });

// ==========================
// Get all employments (employments, social service and professional practices)
// whitout postulations
// ==========================
app.get('/', checkSession, (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    let params_populate = 'name email role domicile description photography';

    Employment.findAll(res, params_populate, req.user._id, from, limit, true);

});


// ==========================
// Get employment by id
// ==========================
app.get('/:id', checkSession, (req, res) => Employment.findById(res, req.params.id));

// ==========================
// Get employments by enterprise
// ==========================
app.get('/enterprise/all', checkSession, (req, res) => {

    id = req.query.id || req.user._id;
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Employment.findByEnterprise(res, id, from, limit);
});

// ==========================
// Get profesional practices
// ==========================
app.get('/profesional/practices', checkSession, (req, res) => {
    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.limit) || 10;
    Employment.findProfesionalPractices(res, from, limit);
});

// ==========================
// Update employment
// ==========================
app.put('/:id', [checkSession, checkEnterpriseRole], (req, res) => Employment.update(res, req.params.id, req.user._id, req.body));

// ==========================
// Crear una vacante (empleo) 
// ==========================
app.post('/', [checkSession, checkEnterpriseRole], (req, res) => {
    let body = req.body;
    body.empresa = req.query.empresaId || req.session.usuario._id;
    Vacante.crear(body)
        .then(resp => {
            res.status(201).json(resp);
            io.emit('nueva-vacante', resp);
        })
        .catch(err => { res.status(err.code).json(err.err) });
});

// ==========================
// Count social service 
// ==========================
app.get('/count/social-service', checkSession, (req, res) => {

    Employment.countSocietyService(req.user._id)
        .then(resp => res.status(200).json(resp))
        .catch(err => { res.status(err.code).json(err.err) });
});

// ==========================
// Count professional practice 
// ==========================
app.get('/count/professional-practice', checkSession, (req, res) => {

    Employment.countProfessionalPractice(req.user._id)
        .then(resp => res.status(200).json(resp))
        .catch(err => { res.status(err.code).json(err.err) });
});



module.exports = app;