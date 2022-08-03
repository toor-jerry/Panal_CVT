const _ = require('underscore');
const PostulacionModel = require('../models/postulacion');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Postulacion {

    static findAll(res, from, limit) {

        PostulationModel.find({})
            .skip(from)
            .limit(limit)
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .populate('user', 'name username email')
            .exec((err, postulations) => {

                if (err) return response500(res, err);

                PostulationModel.countDocuments((err, count) => {

                    if (err) return response500(res, err);

                    res.status(200).json({
                        ok: true,
                        data: postulations,
                        total: count
                    });

                });

            });
    }

    static findByEmployments(res, user, from, limit) {

        PostulationModel.find({ user: user })
            .skip(from)
            .limit(limit)
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .exec((err, postulations) => {
                if (err) return response500(res, err);

                let postulationsTmp = [];
                _.filter(postulations, (post) => {
                    if (post.employment.type === 'JOB_OFFER') {
                        postulationsTmp.push(post.employment)
                    }
                });
                res.status(200).json({
                    ok: true,
                    data: postulationsTmp,
                    total: postulationsTmp.length
                });

            });

    }


    // buscar
    static buscarTodasLasPostulacionesPorUsuario(idUsuario) {

        return new Promise((resolve, reject) => {
        PostulacionModel.find({ usuario: idUsuario })
            .lean()
            .populate('vacante')
            .exec((err, postulaciones) => {

                if (err) reject({ code: 500, err });
                if (!postulaciones) reject({ code: 400, err: 'No se encontraron postulaciones.' });
            
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

                if (err) reject({ code: 500, err });
                if (!postulaciones) reject({ code: 400, err: 'No se encontraron postulaciones.' });
            
                PostulacionModel.countDocuments({ empresa: idEmpresa })
                .exec((err, count) => {

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


    static findById(res, id) {

        PostulationModel.findById(id)
            .populate({
                path: 'employment',
                populate: { path: 'user', select: 'name user role email thumbnail_photography' }
            })
            .populate('user', 'name username email')
            .exec((err, postulation) => {

                if (err) return response500(res, err);
                if (!postulation) return response400(res, 'Postulation not found.');

                response200(res, postulation);
            });

    }

    // Crear
    static crear(data) {
        return new Promise((resolve, reject) => {
            if (!data) return reject({ msg: 'No data', code: 400 });

        PostulacionModel.findOne({ vacante: data.vacante, usuario: data.usuario, empresa: data.empresa }, (err, postulacionDB) => {
            if (err) return reject({ msg: 'Error db', err, code: 500 });

            if (postulacionDB) return reject({ msg: 'Ya ha sido postulad@.', code: 400 });

            let postulacion = new PostulacionModel(data);
            postulacion.save((err, postulacionCreada) => {

                if (err) return reject({ msg: 'Error db', err, code: 500 });

                if (!postulacionCreada) return reject({ msg: 'No se pudo postular.', code: 400 });

                return resolve({
                    data: postulacionCreada
                });
            });
        });

        });
    }

    static delete(res, id_postulation, user) {

        PostulationModel.findOneAndRemove({ _id: id_postulation, user: user }, (err, postulationDeleted) => {

            if (err) return response500(res, err);
            if (!postulationDeleted) return response400(res, 'Could not delete the postulation.');

            response200(res, postulationDeleted);

        });

    }
}


module.exports = {
    Postulacion
}