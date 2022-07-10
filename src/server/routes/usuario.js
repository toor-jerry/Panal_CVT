// express
const express = require('express');
const fileUpload = require('express-fileupload');

const { Usuario } = require('../classes/usuario'); // user class
const { Subir } = require('../classes/subirFotografia'); // user class

const { checkSession, checkAdminRole } = require('../middlewares/auth'); // midlewares auth

// express initialization
const app = express();
// default options (req.files <- todo lo que viene)
app.use(fileUpload());
const { io } = require('../app');

const { today, generarNombreAleatorio,obtenerRutaDeCargaArchivos } = require('../utils/utils');

// ==========================
// Recuperar contraseña (form)
// ==========================
app.get('/recuperar_contrasenia', (req, res) => {
        res.render('recuperar_contrasenia', {
        page: 'Recuperar Contraseña',
        archivoJS: 'function_recuperar_contrasenia.js'
    })
});

// ==========================
// Get all users
// ==========================
app.get('/all', [checkSession, checkAdminRole], async(req, res) => {
    res.status(200).render('dashboard_users', {
        page: 'Dashboard | Usuarios',
        users: await User.findAll()
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),
        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => [])
    })

});

// ==========================
// Crear usuario
// ==========================
app.post('/', (req, res) =>

    Usuario.crear(req.body)
    .then(resp => {
        // session register
        req.session.usuario = resp.data;
        res.status(201).json(resp);
        io.emit('nuevo-usuario', resp);
    })
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

);


// ==========================
// Update view
// ==========================
app.get('/edit/:id', [checkSession, checkAdminRole], async(req, res) => {
    res.render('dashboard_user', {
        page: 'Usuario | Editar',
        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => []),
        user_edit: await User.findById(req.params.id)
            .then(resp => resp.data)
            .catch(() => []),
        areas: await Area.findAll()
            .then(resp => resp.data)
            .catch(() => [])
    })
});

// ==========================
// Actualizar usuario - nuevo Empleo
// ==========================
app.put('/actualizar/empleo', checkSession, (req, res) => {
    Usuario.agregarEmpleo(req.session.usuario._id, req.body)
    .then((usuarioDB) => {
        req.session.usuario = usuarioDB
        res.status(200).json({});
    })
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
});

// ==========================
// Actualizar usuario - nueva Formación
// ==========================
app.put('/actualizar/formacion', checkSession, (req, res) => {
    Usuario.agregarFormacion(req.session.usuario._id, req.body)
    .then((usuarioDB) => {
        req.session.usuario = usuarioDB
        res.status(200).json({});
    })
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
});

// ==========================
// Actualizar usuario
// ==========================
app.put('/actualizar', checkSession, async(req, res) => {

    if (req.files?.foto){
        // console.log(req.files);

    // Extenciones válidas
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // Name file
    const file = req.files.foto;
    const splitName = file.name.split('.');
    const extensionImagen = splitName[splitName.length - 1];

    if (extensionesValidas.indexOf(extensionImagen) < 0)
        return errorExtensiones(res, extensionesValidas, extensionImagen);

    const idUsuario = req.session.usuario._id;
    const nameFile =  generarNombreAleatorio(idUsuario, extensionImagen);

    // Move file
    const path = obtenerRutaDeCargaArchivos("fotografias", nameFile);
    // Size file
    if (file.size > 900000) {

        await Subir.subirFotografia(idUsuario, file.data, nameFile, true);
        await Usuario.actualizar(req.session.usuario._id, req.body)
        .then((usuarioDB) => {
            req.session.usuario = usuarioDB
            res.status(201).json({});
        })
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

    } else {
        await Subir.subirFotografia(idUsuario, file.data, nameFile, false);
        await Usuario.actualizar(req.session.usuario._id, req.body)
        .then((usuarioDB) => {
            req.session.usuario = usuarioDB
            res.status(201).json({});
        })
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

    }
} else {
    Usuario.actualizar(req.session.usuario._id, req.body)
        .then((usuarioDB) => {
            req.session.usuario = usuarioDB
            res.status(200).json({});
        })
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
}

});

// ==========================
// Delete a user by Id
// ==========================
app.delete('/:id', [checkSession, checkAdminRole], (req, res) => {

    User.delete(req.params.id)
        .then(() => res.status(200).json({}))
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

});

// ==========================
// Login
// ==========================
app.post('/login', (req, res) =>
    Usuario.login(req.body.email, req.body.password)
    .then(usuario => {
        // session register
        req.session.usuario = usuario;
        res.status(200).json({ data: usuario });
    })
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
);


const errorExtensiones = (res, extensionesAdmitidas, fileExtention) =>
    res.status(400).json({
        ok: false,
        message: 'Extention inválida!',
        errors: {
            message: 'Extensiones válidas: ' + extensionesAdmitidas.join(', '),
            ext: fileExtention
        }
    });

module.exports = app;