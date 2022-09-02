const _ = require('underscore');
const PostulacionModel = require('../models/postulacion');

const { response500, response400, response200, response201 } = require('../utils/utils');
const {admin} = require('../config/firebaseConfig');
const { Notificacion } = require('../classes/notificacion'); // user class
class Postulacion {


    // buscar
    static buscarTodasLasPostulacionesPorUsuario(idUsuario) {

        return new Promise((resolve, reject) => {
        PostulacionModel.find({ usuario: idUsuario })
            .lean()
            .populate('vacante')
            .exec((err, postulaciones) => {

                if (err) reject({ code: 500, err });
                if (!postulaciones) reject({ code: 400, err: 'No se encontraron postulaciones.' });
            

                postulaciones.forEach((postulacion) => {
                    if (postulacion?.usuario) {
                    const fileRef = admin.storage().bucket('gs://' + process.env.storageBucket).file('fotografias/' + postulacion.usuario._id + '.img');
                    const dateExp = new Date()
                    
                        dateExp.setHours(dateExp.getHours() + 1);
                        fileRef.getSignedUrl({action: 'read', expires: dateExp}).then((res) => {
                            postulacion.usuario.foto = res
                        }).catch((err) => { console.log("no hay foto")});
                    }
                });

                PostulacionModel.countDocuments((err, count) => {

                    if (err) reject({ code: 500, err });

                    return resolve({
                        ok: true,
                        data: postulaciones,
                        total: count
                    });

                });
            });
            });
    }

    static buscarTodasLasPostulacionesPorEmpresa(idEmpresa) {

        return new Promise((resolve, reject) => {
        PostulacionModel.find({ empresa: idEmpresa })
            .lean()
            .populate('usuario')
            .exec((err, postulaciones) => {

                if (err) return reject({ code: 500, err });
                if (!postulaciones) return reject({ code: 400, err: 'No se encontraron postulaciones.' });
                
                postulaciones.forEach((postulacion) => {
                    if (postulacion?.usuario) {
                    const fileRef = admin.storage().bucket('gs://' + process.env.storageBucket).file('fotografias/' + postulacion.usuario._id + '.img');
                    const dateExp = new Date()
                    
                        dateExp.setHours(dateExp.getHours() + 1);
                        fileRef.getSignedUrl({action: 'read', expires: dateExp}).then((res) => {
                            postulacion.usuario.foto = res
                        }).catch((err) => { console.log("Error")});
                    }
                });
                PostulacionModel.countDocuments({ empresa: idEmpresa })
                .exec((err, count) => {

                    if (err) return reject({ code: 500, err });

                    return resolve({
                        ok: true,
                        data: postulaciones,
                        total: count
                    });

                });
            });
            });
    }


    // Crear
    static crear(data) {
        return new Promise((resolve, reject) => {
            if (!data) return reject({ msg: 'No data', code: 400 });
        PostulacionModel.findOne({ vacante: data.vacante, usuario: data.usuario, empresa: data.empresa })
        .populate('vacante')
        .exec((err, postulacionDB) => {
            if (err) return reject({ msg: 'Error db', err, code: 500 });

            if (postulacionDB) return reject({ msg: 'Ya ha sido postulad@.', code: 400 });

            let postulacion = new PostulacionModel(data);
            postulacion.save((err, postulacionCreada) => {
                Notificacion.crear({ para: data.empresa, titulo: 'Nuevo postulante', mensaje: 'Se han postulado para una de sus vacantes.', tipo: 'Personal' })
                .catch((err) => {
                    console.log(err);
                });
                if (err) return reject({ msg: 'Error db', err, code: 500 });

                if (!postulacionCreada) return reject({ msg: 'No se pudo postular.', code: 400 });

                return resolve({
                    data: postulacionCreada
                });
            });
        });

        });
    }



    static actualizar(id, data) {
        return new Promise((resolve, reject) => {
            if (!id) return reject({ msg: 'Petición incorrecta!, falta id de usuario.', code: 400 });
            if (!data) return reject({ msg: 'No data', code: 400 });

            // find user
            PostulacionModel.findById({_id: id})
            .populate('vacante')
            .populate('usuario')
            .populate('empresa')
            .exec((err, userDB) => {

                if (err) return reject({ msg: 'Error server', err, code: 500 });
                if (!userDB) return reject({ msg: 'Usuario no encontrado.', code: 400 });


                userDB = _.extend(userDB, _.pick(data, ['status']));

                // data persist
                userDB.save((err, userUpdate) => {
                    console.log(err);
                    if (err) return reject({ msg: 'Error db', err, code: 500 });
                    if (!userUpdate) return reject({ msg: 'No se pudo actualizar los datos.', code: 400 });

                    
                    resolve(userUpdate);
                });
            });
        });
    }

}


module.exports = {
    Postulacion
}