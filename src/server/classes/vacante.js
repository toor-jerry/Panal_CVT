const _ = require('underscore');
const VacanteModel = require('../models/vacante');
const PostulacionModel = require('../models/postulacion');

const { response500, response400, response200, response201 } = require('../utils/utils');
const base64ArrayBuffer = require('base64-arraybuffer');
const { storage, ref, getBytes, admin } = require('../config/firebaseConfig')


class Vacante {

    static buscarPorId(id) {

        return new Promise((resolve, reject) => {
            VacanteModel.findById(id)
                .populate('empresa')
                .lean()
                .exec((err, vacante) => {

                    if (err) reject({ code: 500, err });
                    if (!vacante) reject({ code: 400, err: 'No se encontró la vacante.' });
                    let idUser;
                    if (vacante?.empresa) {
                        idUser = vacante?.empresa._id;
                    }
                    getBytes(ref(storage, 'fotografias/' + idUser + '.img'))
                        .then(val => {
                            vacante.empresa.foto = base64ArrayBuffer.encode(val)
                        }).catch(err => console.log("Imagen no encontrada"))
                        .finally(() => {
                            return resolve({
                                ok: true,
                                data: vacante
                            });
                        });
                });
        });

    }

    static encontrarPorEmpresa(empresa) {

        return new Promise((resolve, reject) => {
            VacanteModel.find({})
                .or([{ empresa: empresa }, { perfilCreacion: empresa }])
                .lean()
                .sort({ 'fechaCreacion': -1 })
                .exec((err, vacantes) => {

                    if (err) reject({ code: 500, err });
                    if (!vacantes) reject({ code: 400, err: 'No se encontraron vacantes.' });

                    VacanteModel.countDocuments({})
                        .or([{ empresa: empresa }, { perfilCreacion: empresa }])
                        .exec((err, count) => {

                            if (err) reject({ code: 500, err });

                            resolve({
                                ok: true,
                                data: vacantes,
                                total: count
                            });
                        });
                });
        });
    }

    static encontrarTodas() {

        return new Promise((resolve, reject) => {
            VacanteModel.find()
                .lean()
                .sort({ 'fechaCreacion': -1 })
                .populate('empresa', 'razonSocial foto email numeroContacto')
                .exec((err, vacantes) => {

                    if (err) reject({ code: 500, err });
                    if (!vacantes) reject({ code: 400, err: 'No se encontraron vacantes.' });

                    vacantes.forEach((vacante) => {
                        if (vacante?.empresa) {
                            const fileRef = admin.storage().bucket('gs://' + process.env.storageBucket).file('fotografias/' + vacante.empresa._id + '.img');
                            const dateExp = new Date()

                            dateExp.setHours(dateExp.getHours() + 1);
                            fileRef.getSignedUrl({ action: 'read', expires: dateExp }).then((res) => {
                                vacante.empresa.foto = res
                            }).catch((err) => { console.log("Error")});
                        }
                    });
                    VacanteModel.countDocuments({}, (err, count) => {

                        if (err) reject({ code: 500, err });
                        resolve({
                            ok: true,
                            data: vacantes,
                            total: count
                        });
                    });
                });
        });
    }

    static crear(data) {
        return new Promise((resolve, reject) => {
            let body = _.pick(data, ['puesto', 'empresa', 'horarios', 'funciones', 'notas', 'perfilCreacion', 'tipoVacante']);
            if (data?.salario) {
                body.salario = data.salario;
            }
            let vacante = new VacanteModel(body);
            vacante.save((err, vacanteCreada) => {
                if (err) reject({ code: 500, err });
                if (!vacanteCreada) reject({ code: 400, err: 'No se pudo crear la vacante.' });
                resolve({
                    data: vacanteCreada,
                });
            });
        });
    }

    // Eliminar vacante
    static eliminar(idVacante, empresa) {
        return new Promise((resolve, reject) => {
            VacanteModel.findOneAndRemove({ _id: idVacante, empresa: empresa }, (err, vacanteEliminada) => {

                if (err) reject({ code: 500, err });
                if (!vacanteEliminada) reject({ code: 400, err: 'No se pudo eliminar la vacante.' });

                PostulacionModel.deleteMany({ vacante: idVacante }, (err, result) => {
                    if (err) reject({ code: 500, err: 'No se pudieron borrar las postulaciones ligadas a esta vacante.' });

                    resolve({
                        ok: true,
                        data: vacanteEliminada,
                        totalDeleted: result.deletedCount
                    });
                });
            });
        });

    }

    static buscarVacantes = (regex, from = 0, limit = 10) => {

        return new Promise((resolve, reject) => {

            let state = (regex.source.toLowerCase().trim() == 'true') ? true : false;
            let salario = Number(regex.source) || undefined;

            VacanteModel.find({}, 'puesto empresa salario horarios funciones notas fechaCreacion')
                .lean()
                .populate('empresa', 'razonSocial foto')
                .or([{ 'puesto': regex }, { 'horarios': regex }, { 'funciones': regex }, { 'notas': regex }, { 'salario': salario }])
                //.skip(from)
                //.limit(limit)
                .exec((err, vacantes) => {
                    if (err)
                        return reject(`No se pudo buscar '${regex}' en vacantes, ${err}.`);
                    vacantes.forEach((vacante) => {
                        if (vacante?.empresa) {
                            const fileRef = admin.storage().bucket('gs://' + process.env.storageBucket).file('fotografias/' + vacante.empresa._id + '.img');
                            const dateExp = new Date()

                            dateExp.setHours(dateExp.getHours() + 1);
                            fileRef.getSignedUrl({ action: 'read', expires: dateExp }).then((res) => {
                                vacante.empresa.foto = res
                            }).catch((err) => { console.log("Error")});
                        }
                    });
                    VacanteModel.countDocuments({})
                        .or([{ 'puesto': regex }, { 'horarios': regex }, { 'funciones': regex }, { 'notas': regex }, { 'salario': salario }])
                        .exec((err, total) => {
                            if (err)
                                return reject(`No se pudo buscar '${regex}' en vacantes, ${err}.`);
                            else resolve({
                                data: vacantes,
                                total
                            });
                        });

                });
        });
    }

}


module.exports = {
    Vacante
}