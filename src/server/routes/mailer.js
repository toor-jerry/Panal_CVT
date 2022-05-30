// express
const express = require('express');
// express initialization
const app = express();

const nodemailer = require('nodemailer');

const { getHash } = require('../utils/utils');


// ==========================
// Post email
// ==========================
// email sender function
app.post('/', (req, res) => {
    // Definimos el transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD_EMAIL
            }
        });
    // Definimos el email
    let hash = getHash(10);
    let email = req.body.email
    var mailOptions = {
        from: 'Remitente',
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Use el siguiente código como contraseña temporal ${hash}`,
        html: `<p>Use el siguiente código como contraseña temporal <b>${hash}</b></p>`
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, (error, info) =>{
        if (error){
            console.log(error);
            res.status(500).json({ msg: "error", err: error });
        } else {
            console.log("Email sent to: " + email);
            res.status(200).json({ data: email });
        }
    }); 

});





module.exports = app;