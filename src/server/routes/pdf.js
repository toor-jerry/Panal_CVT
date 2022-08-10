const express = require('express');
const { checkSession } = require('../middlewares/auth');

const { PDF } = require('../classes/pdf');
const fs = require('fs');
const path = require('path');
const { response404 } = require('../utils/utils');
const UsuarioModel = require('../models/usuario');
const app = express();

app.get('/', checkSession, (req, res) => {
    let usuario;
    var pathPdf;
    if (req.query.idUsuario) {
        usuario = req.query.idUsuario;
        pathPdf = path.resolve(__dirname, `../../../uploads/cv/Custom_${usuario}.pdf`);
    
    if (fs.existsSync(pathPdf)) {
        res.set({
            "Content-Type": "application/pdf"
        });
        return res.sendFile(pathPdf);
    }
}
        usuario =  req.session.usuario._id;
        PDF.generatePDF(usuario)
            .then(fileName => {
                pathPdf = path.resolve(__dirname, `../../../uploads/cv/${fileName}`);

                if (fs.existsSync(pathPdf)) {
                    res.set({
                        "Content-Type": "application/pdf"
                    });
                    res.sendFile(pathPdf);

                } else {
                    response404(res);
                }
            })
            .catch(err => res.status(err.code).json(err.err));
    });



module.exports = app;