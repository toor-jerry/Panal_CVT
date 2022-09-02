// express
const express = require('express');
const fileUpload = require('express-fileupload');

const { Usuario } = require('../classes/usuario'); // user class
const { Email } = require('../classes/mailer'); // user class
const { Subir } = require('../classes/subir'); // user class
const { Notificacion } = require('../classes/notificacion'); // user class
const nodemailer = require('nodemailer');
const { checkSession, checkAdminRole, intentCheckSession } = require('../middlewares/auth'); // midlewares auth

// express initialization
const app = express();
// default options (req.files <- todo lo que viene)
app.use(fileUpload());
const { io } = require('../app');
const base64ArrayBuffer = require('base64-arraybuffer');
const { storage, ref, getBytes } = require('../config/firebaseConfig')
const { getFile, existeFile } = require('../config/firebaseConfig')
const { today, obtenerRutaDeCargaArchivos } = require('../utils/utils');
const TAMANIO_FOTOGRAFIA = 400;
// ==========================
// Recuperar contraseña (form)
// ==========================
app.get('/recuperar_contrasenia', (req, res) => {
    res.render('recuperar_contrasenia', {
        page: 'Recuperar Contraseña',
        archivoJS: 'function_recuperar_contrasenia.js'
    })
});

app.post('/email/soporte/ayuda', intentCheckSession, async(req, res) => {
    let usuario = '';
    if (req.session.usuario) {
        usuario = req.session.usuario;
    }
    console.log('Llego a soporte');
    await Email.send(email = process.env.EMAIL,
        title = 'Verificación de cuenta',
        text = "Mensaje de ayuda: " + req.body.msg + ' \nUsuario: ' + Object.entries(usuario).map(x=>x.join(":")).join("\n"),
        html = "Mensaje de ayuda: " + req.body.msg + ' \nUsuario: ' + Object.entries(usuario).map(x=>x.join(":")).join("\n"))
        .then(() => console.log({msg: "Email sent to: " + usuario.email}))
        .catch(err => console.log({msg: err.message}));
        res.status(200).json({msg: "Email sent to: " + usuario.email})
});

app.post('/verificacion/cuenta', checkSession, async(req, res) => {
    let usuario = req.session.usuario;
    await Email.send(email = usuario.email,
        title = 'Verificación de cuenta',
        text = `Use el siguiente link ${process.env.URI_SERVER}usuario/actualizar/verificar_Cuenta/edit/${usuario._id} para verificar su cuenta.`,
        html = `<p>Use el siguiente link <b><a href="${process.env.URI_SERVER}usuario/actualizar/verificar_Cuenta/edit/${usuario._id}">Verificar cuenta!</a></b> para verificar su cuenta.</p>`)
        .then(() => console.log({msg: "Email sent to: " + usuario.email}))
        .catch(err => console.log({msg: err.message}));
        res.status(200).json({msg: "Email sent to: " + usuario.email})
});

// ==========================
// Crear usuario
// ==========================
app.post('/', intentCheckSession, (req, res) => {
    let foto = 'undefined';
    if (req.files?.foto) {
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
                Email.send(email = data.email,
                    title = 'Verificación de cuenta',
                    text = `Use el siguiente link ${process.env.URI_SERVER}usuario/actualizar/verificar_Cuenta/edit/${data._id} para verificar su cuenta.`,
                    html = `<p>Use el siguiente link <b><a href="${process.env.URI_SERVER}usuario/actualizar/verificar_Cuenta/edit/${data._id}">Verificar cuenta!</a></b> para verificar su cuenta.</p>`)
                    .then(() => console.log("Email sent to: " + data.email))
                    .catch(err => console.log(err));

            }

            res.status(201).json(resp);
        })
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
}
);

app.get('/actualizar/verificar_Cuenta/edit/:idUsuario', (req, res) => {
    Usuario.actualizar(req.params.idUsuario, { perfilVerificado: 'Verificado' })
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
app.get('/editar/:id', [checkSession, checkAdminRole], async (req, res) => {
    let foto;
    const fotografiasRef = ref(storage, 'fotografias/' + req.params.id + '.img');
    await getBytes(fotografiasRef)
        .then(val => {
            foto = base64ArrayBuffer.encode(val)
        })
        .catch(err => console.log("err"))
    res.render('editar_usuario', {
        foto: foto,
        usuario: await Usuario.findById(req.session.usuario._id)
            .then(resp => resp.data)
            .catch(() => { }),
        usuarioEditar: await Usuario.findById(req.params.id)
            .then(resp => resp.data)
            .catch(() => { }),

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
app.put('/actualizar', checkSession, async (req, res) => {
    let actualizacionDatosMismoUsuario = true;
    const idUsuario = req.query.usuarioId || req.session.usuario._id;
    if (req.query.usuarioId) {
        actualizacionDatosMismoUsuario = false;
    }
    if (req.files?.foto) {
        // console.log(req.files);

        // Extenciones válidas
        const extensionesValidas = ['png', 'jpg', 'jpeg'];

        // Name file
        const file = req.files.foto;
        const splitName = file.name.split('.');
        const extensionImagen = splitName[splitName.length - 1];

        if (extensionesValidas.indexOf(extensionImagen) < 0)
            return errorExtensiones(res, extensionesValidas, extensionImagen);

        const nameFile = `${idUsuario}`;
        //const nameFile = `${idUsuario}.img`;
        await Subir.subirFotografia(file.data, nameFile, '.img', extensionImagen);
        await Usuario.actualizar(idUsuario, req.body)
            .then((usuarioDB) => {
                if (actualizacionDatosMismoUsuario) {
                    req.session.usuario = usuarioDB
                }
                res.status(201).json({});
            })
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
    } else {
        // Si no es actualizado asi mismo y contiene mensaje
        if (!actualizacionDatosMismoUsuario && req.body?.mensaje) {
            if (req.body.mensaje.length > 0) {
                await Email.send(email = req.body.emailUsuario, title = 'Validación de perfil!', text = req.body.mensaje)
                    .then(() => {
                        console.log('Email sent');
                    }).catch(err => {
                        console.log(err);
                    });
            }
            await Notificacion.crear({ para: idUsuario, titulo: 'Validación de perfil', mensaje: 'Se ha validado su cuenta, su nuevo estatus es: "' + req.body?.perfilVerificado + '"', tipo: 'Personal' })
                .catch((err) => {
                    console.log(err);
                });
        }
        await Usuario.actualizar(idUsuario, req.body)
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
        .then((usuario) => res.status(200).json({ data: usuario }))
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
