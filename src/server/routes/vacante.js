const express = require('express'); // express module
const app = express(); // aplication

const { Usuario } = require('../classes/usuario'); // Usuario class
const { Vacante } = require('../classes/vacante'); // Vacante class

const { checkSession, checkEnterpriseRole } = require('../middlewares/auth');

const { io } = require('../app');
const JSONTransport = require('nodemailer/lib/json-transport');


// Creación vacante
app.get('/form/creacion', [checkSession, checkEnterpriseRole], async(req, res) => {

    res.status(200).render('form_creacion_vacante', {
        page: 'Creación',
        nombre_boton_navbar: 'Creación de Vacante',

        usuario: await Usuario.findById(req.session.usuario._id)
        .then(resp => resp.data)
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),
        
        vacantes: await Vacante.encontrarPorEmpresa(req.session.usuario._id)
            .then(resp =>{return { data: resp.data, total: resp.total }})
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

        archivoJS: 'function_perfil.js'
    })
});

// ==========================
// Eliminar una vacante por ID 
// ==========================
app.delete('/:vacante', [checkSession, checkEnterpriseRole], (req, res) => Vacante.eliminar(res, req.params.vacante, req.session.usuario._id));

// Tipo de registro route (postulacion a vacante)
app.get('/:id', checkSession, async(req, res) => {
    let id = req.params.id;
    res.render('registro_vacante', {
        page: 'Postulacion',
        nombre_boton_navbar: 'Información de la vacante',
        direccion_link_boton_navbar: '/perfil',
        mostrar_boton_regreso: true,
        empresa: {
            nombre: 'Farmacias Guadalajara',
            razon_social: 'Cedis Centro Fragu SA de CV',
            foto_empresa: 'https://www.yo-local.com/sites/default/files/imagen_negocio/1_150.jpg',
            correo: 'fragia@gmail.com',
            telefono: '55235345345',
            descripcion_empresa: 'Empresa farmaceutica',
        },
        revisar_cites: await Usuario.findById(req.session.usuario._id)
            .then(resp => {console.log("Data" + resp.data); resp.data})
            .catch(() => {}),
            vacante: {
            puesto: 'Diseñador',
            horarios: 'Lunes - Viernes',
            funciones: 'Diseñar el logo de la empresa',
            notas: 'Se descansa fines de semana',
            salario: '6,000 MXN'
        }
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
    body.empresa = req.session.usuario._id;
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