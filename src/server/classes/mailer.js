
const nodemailer = require('nodemailer');
const uuid = require('uuid');


class Email {
    static send(email, title, text, html) {
    return new Promise((resolve, reject) => {
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
        var mailOptions = {
            from: 'Remitente',
            to: email,
            subject: title,
            text: text,
            html: html
        };
        // Enviamos el email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return reject({ msg: `No se pudo enviar el correo.`, error, code: 500 });
            } else {
                console.log("Email sent to: " + email);
                resolve({ status: true });
            }
        }).catch(err => reject({ msg: `No se pudo enviar el correo.`, error, code: 500 }));
    });
}
}


module.exports = {Email};