const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const base64Img = require('base64-img');
const base64ArrayBuffer = require('base64-arraybuffer');

const UsuarioModel = require('../models/usuario');

const { response500, response400, response200, response201 } = require('../utils/utils');
const { obtenerRutaDeCargaArchivos } = require('../utils/utils');

const { storage, ref, deleteObject, uploadString, admin, getFileRef, updateMetadata } = require('../config/firebaseConfig')


const TAMANIO_FOTOGRAFIA = 400;

class Subir {

    static subirCV(idUsuario, cv) {
        return new Promise((resolve, reject) => {
            UsuarioModel.findById(idUsuario, (err, usuarioDB) => {

                if (err) return reject({ msg: 'Error server', err, code: 500 });
                if (!usuarioDB) return reject({ msg: 'Usuario no encontrado.', code: 400 });

                // Delete old images
                const nameFile = (`${idUsuario}`);

                deleteObject(ref(storage, 'cv/' + idUsuario + '.pdf')).then(() => {
                    console.log("File deleted successfully")
                }).catch((error) => {
                    console.log(error)
                });
                getFileRef('cv', nameFile, '.pdf').save(cv.data).then(() => {
                    console.log("Foto subida con éxito")
                    usuarioDB.curriculoPdf = nameFile;

                    usuarioDB.save((err, userUpdate) => {


                        if (err) return reject({ msg: 'Error db', err, code: 500 });
                        if (!userUpdate) return reject({ msg: 'No se pudo actualizar los datos.', code: 400 });
                        return resolve(userUpdate);
                    });
                    resolve(true);
            }).catch(err => console.log(err))


            });
        });
    }

    static subirFotografia(img, idUsuario, extension, type) {
        return new Promise((resolve, reject) => {
                    sharp(img)
                        .resize({
                            width: TAMANIO_FOTOGRAFIA
                        })
                        .toBuffer()
                        .then((data) => {
                            // Create a child reference
                            const fotografiasRef = ref(storage, 'fotografias/' + idUsuario + extension);
                            deleteObject(fotografiasRef).then(() => {
                                console.log("File deleted successfully")
                            }).catch((error) => {
                                console.log("error")
                            });
                            getFileRef('fotografias', idUsuario, extension).save(data).then(() => {
                                console.log("Foto subida con éxito")
                                resolve(true);
                                updateMetadata(fotografiasRef, {
                                    customMetadata: {
                                      'type': `${type}`
                                    }
                                  }).then(() => console.log("Metada updated successfully"))
                                .catch((error) => { console.log("error")});
                        }).catch(err => console.log(err))
    });
    });
}


}

module.exports = {
    Subir
}