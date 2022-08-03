const _ = require('underscore');
const NotificacionModel = require('../models/notificacion');

const { response500, response400, response200, response201 } = require('../utils/utils');

class Notificacion {

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

    // buscar por usuario
    static buscarPorUsuario(idUsuario,limit) {

        return new Promise((resolve, reject) => {
        NotificacionModel.find({})
            .or([{ para: idUsuario }, {tipo: 'Todos'}])
            .lean()
            .limit(limit)
            .populate('de')
            .sort({ 'fechaNotificacion': -1 })
            .exec((err, notificaciones) => {

                if (err) reject({ code: 500, err });
                if (!notificaciones) reject({ code: 400, err: 'No se encontraron notificaciones.' });
            
                NotificacionModel.countDocuments({})
                .or([{ para: idUsuario }, {tipo: 'Todos'}])
                .exec((err, count) => {

                    if (err) reject({ code: 500, err });

                    return resolve({
                        ok: true,
                        data: notificaciones,
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

            let postulacion = new NotificacionModel(data);
            postulacion.save((err, postulacionCreada) => {

                if (err) return reject({ msg: 'Error db', err, code: 500 });

                if (!postulacionCreada) return reject({ msg: 'No se pudo crear la notificación.', code: 400 });

                return resolve({
                    data: postulacionCreada
                });
        });

        });
    }
}


module.exports = {
    Notificacion
}