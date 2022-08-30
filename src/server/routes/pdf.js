const express = require('express');
const { checkSession } = require('../middlewares/auth');

const { PDF } = require('../classes/pdf');
const fs = require('fs');
const path = require('path');
const { response404 } = require('../utils/utils');
const UsuarioModel = require('../models/usuario');
const app = express();
const { storage, ref, deleteObject, uploadString, admin, getFileRef, getBytes } = require('../config/firebaseConfig')

app.get('/', checkSession, async(req, res) => {

    let usuario;
    var pathPdf;
    if (req.query.idUsuario) {
        usuario = req.query.idUsuario;
        await getBytes(ref(storage, 'cv/Custom_' + usuario + '.pdf')).then((response) => {
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=CV.Pdf')
            return res.send(Buffer.from(response))
    }).catch((error) => {
        console.log("No encontrado");
        usuario = req.query.idUsuario;
        generatePDFServer(res, usuario)
    })
    }
        else {
            usuario =  req.session.usuario._id;
            await getBytes(ref(storage, 'cv/Custom_' + usuario + '.pdf')).then((response) => {
                res.setHeader('Content-Type', 'application/pdf')
                res.setHeader('Content-Disposition', 'attachment; filename=CV.Pdf')
                return res.send(Buffer.from(response))
        }).catch((error) => {
            console.log("no encontrado")
            generatePDFServer(res, usuario)
        });
        }
        
});

function generatePDFServer(res, usuario) {
    PDF.generatePDF(usuario).then((nameFile) => {
        pathPdf = path.resolve(__dirname, `../classes/temp/${nameFile}`);
        res.sendFile(pathPdf, () => {
            console.log("Limpieza, eliminado el archivo de temp: " + nameFile)
        if (fs.existsSync(pathPdf)) {
            fs.unlinkSync(pathPdf);
        }
        })
    }).catch(err => {
        console.log(err)
        return response400(err)
    })
}



module.exports = app;