const express = require('express');
const { checkSession } = require('../middlewares/auth');

//const { PDF } = require('../classes/pdf');
const { PDF } = require('../classes/pdf-PHP-Data');
const fs = require('fs');
const path = require('path');
const { response404, response200, response403 } = require('../utils/utils');
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

const base64ArrayBuffer = require('base64-arraybuffer');
app.get('/', checkSession, async(req, res) => {

    let usuario;
    var foto;
    if (req.query.idUsuario) {
        usuario = req.query.idUsuario;
    }else {
        usuario =  req.session.usuario._id;
    }
    console.log(usuario);
    const fotografiasRef = ref(storage, 'fotografias/' + usuario + '.img');
    await Promise.all([
       // getBytes(fotografiasRef),
        existeFile('cv', usuario, '.pdf'),
        PDF.getData(usuario)
    ])
    .then(responses =>{
       
            if (responses[0][0]) {
                getFile('cv', usuario, '.pdf').then((resUrl) => {
                    return res.status(200).json({ url: resUrl });
                }).catch((err) => console.log('No pdf'))
            } else {
                //foto =`foto=${base64ArrayBuffer.encode(responses[0])}` 
                if (process.env.NODE_ENV == 'dev') {
                    return res.status(200).json({ url: "http://localhost/Servidor_PHP/" +  responses[1] });
                } else {
                        
                        return res.status(200).json({ url: "https://panalcuvt.000webhostapp.com/" +  responses[1] });
                }
                }
        }).catch(err =>
        response404(res, err)
    );     
           
});





module.exports = app;