const express = require('express');
const { checkSession } = require('../middlewares/auth');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const json2csv = require('json2csv').parse;

const { response400, response404, response500 } = require('../utils/utils');
const { Subir } = require('../classes/subir'); // user class
const { Usuario } = require('../classes/usuario'); // user class

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

// Verificación de perfil en proceso route
app.get('/registros_entrevistas', checkSession, (req, res) => {
    Usuario.buscaTodosLosEstudiantes()
    .then(resp => descargaCSV(res, resp.data, 'registros_entrevistas.csv'))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
});

// Verificación de perfil en proceso route
app.get('/registros_verificacion', checkSession, (req, res) => {
    Usuario.buscaTodasLasEmpresas()
    .then(resp => descargaCSV(res, resp.data, 'registros_verificacion.csv'))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
});

function descargaCSV(res, data, nombreArchivo) {
        res.setHeader('Content-disposition', 'attachment; filename='+nombreArchivo);
        res.set('Content-Type', 'text/csv');
        return res.status(200).send(json2csv(data));
}

// Carga de archivos generica
app.put('/archivo/:carpeta', checkSession, (req, res) => {

    const carpeta = req.params.carpeta;

    if (!req.files) return response400(res, 'No data.');
    
    // Types files
    const carpetasValidas = ['INE', 'RFC', 'comprobantesDomicilio'];
    if (carpetasValidas.indexOf(carpeta) < 0) return response400(res, 'Carpeta no válida! ' + carpetasValidas);

    // Name file
    const file = req.files.file;
    const splitName = file.name.split('.');
    const fileExtention = splitName[splitName.length - 1];

    // Extentions valid
    const extentionsValid = ['pdf'];

    if (extentionsValid.indexOf(fileExtention) < 0)
        return errorExtensiones(res, extentionsValid, fileExtention);

    // Custom file name
    // Move file
    const path = obtenerRutaDeCargaArchivos(carpeta, `${req.session.usuario._id}.${fileExtention}`);

    file.mv(path, err => {
        if (err) return response500(res, err);
        res.status(201).json({});
    });

});

// ==========================
// Subir un CV
// ==========================
app.post('/cv', checkSession, async(req, res) => {
if (req.files?.cv){

// Extenciones válidas
const extensionesValidas = ['pdf'];

// Name file
const cv = req.files.cv;
const splitName = cv.name.split('.');
const extensionCV = splitName[splitName.length - 1];

if (extensionesValidas.indexOf(extensionCV) < 0)
    return errorExtensiones(res, extensionesValidas, extensionCV);

await Subir.subirCV(req.session.usuario._id, cv)
.then((usuarioDB) => {
    req.session.usuario = usuarioDB
    res.status(201).json({});
})
.catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

} else {
  response400(res, "No data")
}
});

module.exports = app;
