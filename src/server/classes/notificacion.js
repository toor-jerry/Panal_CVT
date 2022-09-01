const _ = require('underscore');
const NotificacionModel = require('../models/notificacion');

const { response500, response400, response200 } = require('../utils/utils');

class Notificacion {

    // buscar por usuario
    static buscarPorUsuario(usuario,limit) {

        return new Promise((resolve, reject) => {
        NotificacionModel.find({})
            .or([{ para: usuario._id }, {tipo: 'Todos'}])
            .lean()
            .limit(limit)
            .populate('de')
            .sort({ 'fechaNotificacion': -1 })
            .exec((err, notificaciones) => {

                if (err) reject({ code: 500, err });
                if (!notificaciones) reject({ code: 400, err: 'No se encontraron notificaciones.' });
            let count = 0;
            let newNotificaciones = [];
                notificaciones.forEach((notificacion) => { 
                    if (notificacion.tipo === 'Todos' && usuario.userRole !== 'USER_ENTERPRISE') {
                        newNotificaciones.push(notificacion);
                        count = count + 1;
                    } else if (notificacion.tipo === 'Personal') {
                        newNotificaciones.push(notificacion);
                        count=count + 1;
                    }
                });
                return resolve({
                    ok: true,
                    data: newNotificaciones,
                    total: count
                });
               /* NotificacionModel.countDocuments({})
                .or([{ para: idUsuario }, {tipo: 'Todos'}])
                .exec((err, count) => {

                    if (err) reject({ code: 500, err });

                    return resolve({
                        ok: true,
                        data: notificaciones,
                        total: count
                    });

                });*/
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