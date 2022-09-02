const express = require('express');
const { checkSession } = require('../middlewares/auth');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const json2csv = require('json2csv').parse;

const { response400, response404, response500 } = require('../utils/utils');
const { Subir } = require('../classes/subir'); // user class
const { Usuario } = require('../classes/usuario'); // user class
const { PDF } = require('../classes/pdf'); // user class

const base64ArrayBuffer = require('base64-arraybuffer');
//const { obtenerRutaDeCargaArchivos } = require('../utils/utils');
const { storage, ref, deleteObject, uploadString, admin, getFileRef, getBytes, getMetadata } = require('../config/firebaseConfig')

const app = express();
// default options (req.files <- todo lo que viene)
app.use(fileUpload());

                        

 
app.get('/info/metadata/fotografia/:idUsuario', async(req, res) => {
    const fotografiasRef = ref(storage, 'fotografias/' + req.params.idUsuario + '.img');
    getMetadata(fotografiasRef)
    .then((metadata) => {
      // Metadata now contains the metadata for 'images/forest.jpg'
      res.send(metadata.customMetadata.type);
      console.log(metadata.customMetadata.type)
    })
    .catch((error) => {
      // Uh-oh, an error occurred!
      console.log("No se pudo consumir la metadata")
    });
});
app.get('/:idUsuario', async(req, res) => {
    const fotografiasRef = ref(storage, 'fotografias/' + req.params.idUsuario + '.img');
 
await getBytes(fotografiasRef)
                    .then(val => {
                        
                        res.send(base64ArrayBuffer.encode(val))
                    })
                    .catch(err => {
                        res.send(undefined)
                        console.log('No existe la foto')
                    })
                });
/*app.get('/:carpeta/:idUsuario/:extensionFile', checkSession, async(req, res) => {

    const carpeta = req.params.carpeta;
    const extensionFile = req.params.extensionFile;
    const idUsuario = req.params.idUsuario;
    let pathPdf = '';
    await getBytes(ref(storage, 'cv/Custom_' + idUsuario + extensionFile)).then((response) => {
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=CV.Pdf')
        return res.send(Buffer.from(response))
            
    }).catch((err) => {
        console.log(err)
        res.set({
            "Content-Type": "application/pdf",
            'Content-Disposition': 'attachment; filename=CV.Pdf'
        });
        PDF.generatePDF(idUsuario).then((nameFile) => {
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
        
    });

});*/

// Verificación de perfil en proceso route
app.get('/download/registros/registros_entrevistas', checkSession, (req, res) => {
    Usuario.buscaTodosLosEstudiantes()
    .then(resp => descargaCSV(res, resp.data, 'registros_entrevistas.csv'))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
});

// Verificación de perfil en proceso route
app.get('/download/registros/registros_verificacion', checkSession, (req, res) => {
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
app.put('/archivo/:carpeta', checkSession, async(req, res) => {
 
    const carpeta = req.params.carpeta;
    let idUsuario = req.session.usuario._id;
    if (!req.files) return response400(res, 'No data.');
    
    // Types files
    const carpetasValidas = ['INE', 'RFC', 'comprobantesDomicilio', 'CartaCompromiso'];
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
    const nameFile = `${idUsuario}.pdf`;

                await deleteObject(ref(storage, carpeta +'/' + nameFile)).then(() => {
                    console.log("File deleted successfully")
                    getFileRef(carpeta, idUsuario, '.pdf').save(file.data).then(() => {
                        console.log("Archivo subido con éxito")
                        res.status(201).json({});
                }).catch(err => response500(res, err))
                }).catch((error) => {
                    console.log(error)
                    getFileRef(carpeta, idUsuario, '.pdf').save(file.data).then(() => {
                        console.log("Archivo subido con éxito")
                        res.status(201).json({});
                }).catch(err => response500(res, err))
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
.then(() => {
    res.status(201).json({});
})
.catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

} else {
  response400(res, "No data")
}
});

module.exports = app;
