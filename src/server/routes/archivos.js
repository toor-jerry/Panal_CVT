const express = require('express');
const { checkSession } = require('../middlewares/auth');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const { response400, response404, response500 } = require('../utils/utils');
const { Subir } = require('../classes/subir'); // user class

const { generarNombreAleatorio,obtenerRutaDeCargaArchivos } = require('../utils/utils');

const app = express();
// default options (req.files <- todo lo que viene)
app.use(fileUpload());

app.get('/:colection/:file', checkSession, (req, res) => {

    const colection = req.params.colection;
    const file = req.params.file;

    const pathArchivo = path.resolve(__dirname, `../../../uploads/${ colection }/${file}`);

    if (fs.existsSync(pathArchivo)) {
        res.sendFile(pathArchivo);
    } else {
        response404(res);
    }

});

// ==========================
// Subir un CV
// ==========================
app.post('/cv', checkSession, (req, res) => {
if (req.files?.cv){

// Extenciones válidas
const extensionesValidas = ['pdf'];

// Name file
const file = req.files.cv;
const splitName = file.name.split('.');
const extensionCV = splitName[splitName.length - 1];

if (extensionesValidas.indexOf(extensionCV) < 0)
    return errorExtensiones(res, extensionesValidas, extensionCV);

const nameFile =  generarNombreAleatorio(`Custom_${req.session.usuario._id}`, extensionCV);

// Move file
const path = obtenerRutaDeCargaArchivos("cv", nameFile);

// Eliminar el antiguo CV
if (fs.existsSync(path)) {
    fs.unlinkSync(path);
}

file.mv(path, err => {
    if (err) return response500(res, err);
    res.status(200).json({
        ok: true,
        data: nameFile
    });

});

} else {
  response400(res, "No data")
}

});

module.exports = app;
