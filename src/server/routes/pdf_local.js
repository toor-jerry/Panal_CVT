const express = require('express');
const { checkSession } = require('../middlewares/auth');

//const { PDF } = require('../classes/pdf');
const { PDF } = require('../classes/pdf-PHP-Data');
const fs = require('fs');
const path = require('path');
const { response404, response200 } = require('../utils/utils');
const UsuarioModel = require('../models/usuario');
const app = express();
const https = require('https');
const axios = require('axios');
const download = require('downloadjs');
const { writeFile } = require('fs/promises');
const { storage, ref, deleteObject, uploadString, admin, getFileRef, getBytes, existeFile, getFile } = require('../config/firebaseConfig');
const { response } = require('express');
const console = require('console');
const PDFExtract = require('pdf.js-extract').PDFExtract;

app.get('/', checkSession, async(req, res) => {

    let usuario;
    let fotoUrl;
    await existeFile('fotografias',  user._id, '.img').then((response)=> {
        if (response[0]) {
                getFile('fotografias', user._id, '.img').then((res) => foto +=`foto=${res}&`).catch((err) => console.log('No image'))
        }});
    if (req.query.idUsuario) {
        usuario = req.query.idUsuario;
        await existeFile('cv', usuario, '.pdf').then((response)=> {
            if (res[0]) {
                getFile('cv', usuario, '.pdf').then((resUrl) => {
                    return res.status(200).json({ url: resUrl });
                }).catch((err) => console.log('No pdf'))
            }
            PDF.getData(usuario).then((data) => {
                console.log(data)
                return res.status(200).json({ url: "https://panalcuvt.000webhostapp.com/" + data + 'foto=' + foto });
            }).catch((err) => response404(err));
            
        })
        /*await getBytes(ref(storage, 'cv/Custom_' + usuario + '.pdf')).then((response) => {
            
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
    })*/
    }
        else {
            usuario =  req.session.usuario._id;
                        
            await existeFile('cv', usuario, '.pdf').then((response)=> {
                if (res[0]) {
                    getFile('cv', usuario, '.pdf').then((resUrl) => {
                        return res.status(200).json({ url: resUrl });
                    }).catch((err) => console.log('No pdf'))
                }
                PDF.getData(usuario).then((data) => {
                    console.log(data)
                    return res.status(200).json({ url: "https://panalcuvt.000webhostapp.com/" + data + 'foto=' + foto});
                }).catch((err) => response404(err));
            })
            /*await getBytes(ref(storage, 'cv/Custom_' + usuario + '.pdf')).then((response) => {
                console.log(response)
                if (response) {
                res.setHeader('Content-Type', 'application/pdf')
                res.setHeader('Content-Disposition', 'attachment; filename=CV.Pdf')
                return res.send(Buffer.from(response))
                }
        }).catch((error) => {
            axios.get(
                "https://panalcuvt.000webhostapp.com/"
              ).then((response) => {
                //res.setHeader('Content-Type', 'application/pdf')
                //res.setHeader('Content-Disposition', 'attachment; filename=CV.Pdf')
                console.log(response.data)
                res.send(response.data)
                //res.send(response)
              })
            //generatePDFServer(res, usuario)
        });*/
        }
        
});

function generatePDFServer(res, usuario) {
    /*PDF.generatePDF(usuario).then((nameFile) => {
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
    })*/
}



module.exports = app;