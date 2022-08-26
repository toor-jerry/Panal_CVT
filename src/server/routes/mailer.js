// express
const express = require('express');
// express initialization
const app = express();

const nodemailer = require('nodemailer');
const uuid = require('uuid');
const { Usuario } = require('../classes/usuario'); // user class
const { Notificacion } = require('../classes/notificacion'); // user class



// ==========================
// Post email
// ==========================
// email sender function
app.post('/recuperarContrasenia', async (req, res) => {
    // Definimos el transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_EMAIL
        }
    });
    // Definimos el email
    const hash = uuid.v1()
    let email = req.body.email
    var mailOptions = {
        from: 'Remitente',
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Use el siguiente código como contraseña temporal ${hash}`,
        html: `<p>Use el siguiente código como contraseña temporal <b>${hash}</b></p>`
    };
    // Enviamos el email
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ msg: "error", err: error });
        } else {
            console.log("Email sent to: " + email);
            Usuario.actualizarContrasenia(email, hash, true)
                .then((usuarioDB) => {
                    Notificacion.crear({ para: usuarioDB._id, titulo: 'Recuperación de contraseña', mensaje: 'Se ha enviado un correo con la nueva contraseña', tipo: 'Personal' })
                        .catch((err) => {
                            console.log(err);
                        });
                    res.status(201).json({
                        data: email
                    });
                })
                .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
        }
    });

});


module.exports = app;