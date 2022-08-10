const _ = require('underscore');
const NotificacionModel = require('../models/notificacion');

const { response500, response400, response200 } = require('../utils/utils');

class Notificacion {

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