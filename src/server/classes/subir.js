const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const base64Img = require('base64-img');
const base64ArrayBuffer = require('base64-arraybuffer');

const UsuarioModel = require('../models/usuario');

const { response500, response400, response200, response201 } = require('../utils/utils');
const { obtenerRutaDeCargaArchivos } = require('../utils/utils');

const { storage, ref, deleteObject, uploadString } = require('../config/firebaseConfig')


const TAMANIO_FOTOGRAFIA = 400;

class Subir {

    static subirCV(id_usuario, cv) {
        let file = cv;
        return new Promise((resolve, reject) => {
            UsuarioModel.findById(id_usuario, (err, usuarioDB) => {

                if (err) return reject({ msg: 'Error server', err, code: 500 });
                if (!usuarioDB) return reject({ msg: 'Usuario no encontrado.', code: 400 });

                // Delete old images
                const nameFile = (`Custom_${id_usuario}.pdf`);
                const path = obtenerRutaDeCargaArchivos("cv", nameFile);
                // Eliminar el antiguo CV
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }

                cv.mv(path, err => {
                    if (err) return reject({ msg: 'No pudo subirse el archivo.', err, code: 500 });

                    usuarioDB.curriculoPdf = nameFile;

                    usuarioDB.save((err, userUpdate) => {


                        if (err) return reject({ msg: 'Error db', err, code: 500 });
                        if (!userUpdate) return reject({ msg: 'No se pudo actualizar los datos.', code: 400 });
                        return resolve(userUpdate);
                    });

                })


            });
        });
    }

    static subirFotografia(img, nombreFoto, tam) {
        return new Promise((resolve, reject) => {
                    sharp(img)
                        .resize({
                            width: tam
                        })
                        .toFormat('jpeg')
                        .toBuffer()
                        .then((data) => {
                            const base64Data = data.toString('base64');
                            // Create a child reference
                            const fotografiasRef = ref(storage, 'fotografias/' + nombreFoto);
                            deleteObject(fotografiasRef).then(() => {
                                console.log("File deleted successfully")
                            }).catch((error) => {
                                console.log(error)
                            });
                            uploadString(fotografiasRef, base64Data, 'base64').then((snapshot) => {
                                console.log("Foto subida con éxito")
                                resolve(snapshot);
                                });
                            }).catch(err => console.log(err))
    });
    }


    static deletePhotography(res, user) {
        UserModel.findById(user, (err, user) => {

            if (err) return response500(res, err);
            if (!user) return response400(res, 'User not found.');

            if (user.photography)
                this.deleteFile('photography', user.photography);

            if (user.thumbnail_photography)
                this.deleteFile('photographyChat', user.thumbnail_photography);

            user.photography = undefined;
            user.thumbnail_photography = undefined;

            user.save((err, userUpdated) => {

                if (err) return response500(res, err);
                response201(res, userUpdated.photography);

            });

        });
    }

    static deleteFile(dirName, nameFile) {
        let pathOld = path.resolve(__dirname, `../../../uploads/${dirName}/${nameFile}`);
        if (fs.existsSync(pathOld)) {
            fs.unlinkSync(pathOld);
        }
    }

    static resizeImage(img, dirName, fileName, width = SIZE_FILES_IMG) {
        sharp(img)
            .resize({
                width: width
            })
            .toFile(`./uploads/${dirName}/${fileName}`)
            .catch(err => console.log('Err ' + err));
    }


}

module.exports = {
    Subir
}