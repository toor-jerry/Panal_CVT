// express
const express = require('express');
const fileUpload = require('express-fileupload');

const { Usuario } = require('../classes/usuario'); // user class
const { Email } = require('../classes/mailer'); // user class
const { Subir } = require('../classes/subir'); // user class

const { checkSession, checkAdminRole, intentCheckSession } = require('../middlewares/auth'); // midlewares auth
const { storage, ref, getBytes} = require('../config/firebaseConfig')
// express initialization
const app = express();
// default options (req.files <- todo lo que viene)
app.use(fileUpload());
const { io } = require('../app');

const { today, obtenerRutaDeCargaArchivos } = require('../utils/utils');

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
// Crear usuario
// ==========================
app.post('/', intentCheckSession, (req, res) => {
    let foto = 'undefined';
    if (req.files?.foto){
        foto = req.files.foto;
    }
    Usuario.crear(req.body, foto)
    .then(resp => {
        // session register
        let data = resp.data;
        if (!req.session.usuario) {
        req.session.usuario = data;
        }
        
        if (data.userRole === 'USER_PERSONAL') {
            Email.send(email=data.email, 
                        title='Verificación de cuenta', 
                        text=`Use el siguiente link ${process.env.URI_SERVER}/usuario/actualizar/verificar_Cuenta/${data._id} para verificar su cuenta.`,
                        html=`<p>Use el siguiente link <b>${process.env.URI_SERVER}/usuario/actualizar/verificar_Cuenta/${data._id}</b> para verificar su cuenta.</p>`)
                        .then(() => console.log("Email sent to: " + data.email))
                        .catch(err => console.log(err));
                        
        }
        
        res.status(201).json(resp);
    })
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
}
);

app.get('/actualizar/verificar_Cuenta/:idUsuario', (req, res) => {
    Usuario.actualizar(req.params.idUsuario, {perfilVerificado: 'Verificado'})
        .then((usuarioDB) => {
            req.session.usuario = usuarioDB
            res.render('verificacionCuenta', {
                msg: 'Su cuenta ha sido validada correctamente!',
            })
        })
        .catch(err => res.render('verificacionCuenta', {
            msg: err
        }))
    });


// ==========================
//Editar usuario
// ==========================
app.get('/editar/:id', [checkSession, checkAdminRole], async(req, res) => {
    res.render('editar_usuario', {
        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(() => {}),
        usuarioEditar: await Usuario.findById(req.params.id)
        .then(resp => resp.data)
        .catch(() => {}),

        page: 'Mi Perfil Sistemas',
        nombre_boton_navbar: 'Mi Perfil Sistemas',
        direccion_link_boton_navbar: '/perfil/sistemas',
        mostrar_boton_regreso: true,
        archivoJS: 'function_actualizar_usuario.js'
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
// Actualizar usuario - eliminar Empleo
// ==========================
app.delete('/eliminar/empleo/:empleo', checkSession, (req, res) => {
    Usuario.eliminarEmpleo(req.session.usuario._id, req.params.empleo)
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
// Actualizar usuario - eliminar formacion
// ==========================
app.delete('/eliminar/formacion/:idEstudio', checkSession, (req, res) => {
    Usuario.eliminarEstudio(req.session.usuario._id, req.params.idEstudio)
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
    let actualizacionDatosMismoUsuario = true;
    const idUsuario = req.query.usuarioId || req.session.usuario._id;
    if (req.query.usuarioId) {
        actualizacionDatosMismoUsuario = false;
    }
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

    //const nameFile =  `${idUsuario}.${extensionImagen}`;
    const nameFile = `${idUsuario}.img`;
    // Size file
    let size;
    if (file.size < 900000) {
        size = file.size;
    }
        await Subir.subirFotografia(file.data, nameFile, size);
        await Usuario.actualizar(idUsuario, req.body)
        .then((usuarioDB) => {
            if (actualizacionDatosMismoUsuario) {
            req.session.usuario = usuarioDB
            }
            res.status(201).json({});
        })
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
} else {
    Usuario.actualizar(idUsuario, req.body)
        .then((usuarioDB) => {
            if (actualizacionDatosMismoUsuario) {
            req.session.usuario = usuarioDB
            }
            res.status(200).json({});
        })
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
}

});

// ==========================
// Borarar usuario
// ==========================
app.delete('/:id', [checkSession, checkAdminRole], (req, res) => {

    Usuario.delete(req.params.id)
        .then((usuario) => res.status(200).json({data: usuario}))
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
