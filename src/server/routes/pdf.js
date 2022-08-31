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
            
            if (response) {
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'attachment; filename=CV.Pdf')
            return res.send(Buffer.from(response))
            } else {
                return response404('file not found')
            }
    }).catch((error) => {
        console.log("No encontrado");
        generatePDFServer(res, usuario)
    })
    }
        else {
            usuario =  req.session.usuario._id;
            await getBytes(ref(storage, 'cv/Custom_' + usuario + '.pdf')).then((response) => {
                console.log(response)
                if (response) {
                res.setHeader('Content-Type', 'application/pdf')
                res.setHeader('Content-Disposition', 'attachment; filename=CV.Pdf')
                return res.send(Buffer.from(response))
                }
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
        } else {
            return response404('File not found');
        }
        })
    }).catch(err => {
        console.log("No se pudo generar")
        return response404(err)
    })
}



module.exports = app;