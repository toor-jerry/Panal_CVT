
// Encrypt library
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const { obtenerRutaDeCargaArchivos } = require('../utils/utils');
const fs = require('fs');
const path = require('path');
// Usuario model
const UsuarioModel = require('../models/usuario');
const { Subir } = require('../classes/subir'); // user class
const { response500, response400, response200, response201 } = require('../utils/utils');

class Usuario {

    // search all users
    static findAll() {
        return new Promise((resolve, reject) => {

            UsuarioModel.find({})
                .lean()
                .exec((err, users) => {
                    if (err) reject({ msg: `Could not found users.`, err, code: 500 });
                    resolve({ data: users });

                });
        });
    }

    // search user by id
    static findById(id) {
        return new Promise((resolve, reject) => {

            UsuarioModel.findById(id)
                .lean()
                .exec((err, user) => {

                    if (err) reject({ msg: `No se pudo encontrar el usuario.`, err, code: 500 });
                    if (!user) reject({ msg: `Usuario no encontrado.`, code: 400 });

                    resolve({ data: user });

                });
        });
    }

    // Busca empresas
    static buscaEmpresas(from, limit) {

        return new Promise((resolve, reject) => {
            UsuarioModel.find({ userRole: 'USER_ENTERPRISE' })
                .skip(from - 1)
                .limit(limit)
                .lean()
                .exec((err, empresas) => {

                    if (err) reject({ msg: `No se pudo buscar las empresas.`, err, code: 500 });

                    UsuarioModel.countDocuments({ userRole: 'USER_ENTERPRISE' }, (err, count) => {

                        if (err) reject({ msg: `No se pudo contar las empresas.`, err, code: 500 })
                        resolve({
                            ok: true,
                            data: empresas,
                            total: count,
                            paginas: Math.ceil(count / limit)
                        });


                    });
                });
        });
    }

    static buscaEstudiantes(from, limit) {

        return new Promise((resolve, reject) => {
            UsuarioModel.find({ userRole: 'USER_PERSONAL' })
                .skip(from - 1)
                .limit(limit)
                .lean()
                .exec((err, estudiantes) => {

                    if (err) reject({ msg: `No se pudo buscar los estudiantes.`, err, code: 500 });

                    UsuarioModel.countDocuments({ userRole: 'USER_PERSONAL' }, (err, count) => {

                        if (err) reject({ msg: `No se pudo contar los estudiantes.`, err, code: 500 })
                        resolve({
                            ok: true,
                            data: estudiantes,
                            total: count,
                            paginas: Math.ceil(count / limit)
                        });


                    });
                });
        });
    }

    // Busca empresas
    static buscaTodasLasEmpresas() {

        return new Promise((resolve, reject) => {
            UsuarioModel.find({ userRole: 'USER_ENTERPRISE' })
                .lean()
                .exec((err, empresas) => {

                    if (err) reject({ msg: `No se pudo buscar las empresas.`, err, code: 500 });
                    
                        resolve({
                            ok: true,
                            data: empresas,
                            total: empresas.length
                        });
                });
        });
    }

    // Busca empresas
    static buscaTodosLosEstudiantes() {
        return new Promise((resolve, reject) => {
            UsuarioModel.find({ userRole: 'USER_PERSONAL' })
                .lean()
                .exec((err, users) => {

                    if (err) return reject({ msg: `No se pudo buscar los estudiantes.`, err, code: 500 });

                    if (!users) return reject({ msg: `No se pudo obtener los datos.`, code: 500 })
                    return resolve({
                        ok: true,
                        data: users
                    });
                });
        });
    }

    // Crear un usuario
    static crear(data, foto) {
        return new Promise((resolve, reject) => {
            if (!data) return reject({ msg: 'No data', code: 400 });

            // unique email
            UsuarioModel.findOne({ email: data.email })
                .exec((err, userDB) => {

                    if (err) return reject({ msg: 'Error db', err, code: 500 });
                    if (data.password == undefined) return reject({ msg: 'La contraseña es obligatoria.', err: 'No data.', code: 500 });
                    if (userDB) return reject({ msg: 'El email ya se encuentra registrado en nuestra base de datos.', code: 400 });
                    // data definiticion
                    let body = {
                        nombre: data.nombre,
                        apellidos: data.apellidos,
                        email: data.email,
                        password: bcrypt.hashSync(data.password, 10), // encrypt password
                        userRole: data.role,
                        numeroContacto: data.numeroContacto,
                        rfc: data.rfc,
                        direccion: data.direccion,
                        descripcion: data.descripcion,
                    };
                    if (data.razonSocial) {
                        body.razonSocial = data.razonSocial;
                    }
                    // new model of user
                    let usuario = new UsuarioModel(body);

                    // data persist
                    usuario.save((err, usuarioNuevo) => {

                        if (err) return reject({ msg: 'Error db', err, code: 500 });
                        if (!usuarioNuevo) return reject({ msg: 'No se pudo crear el usuario.', code: 400 });


                        if (foto){
                            // console.log(req.files);
                    
                        // Extenciones válidas
                        const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
                    
                        // Name file
                        const file = foto;
                        const splitName = file.name.split('.');
                        const extensionImagen = splitName[splitName.length - 1];
                    
                    
                        const nameFile =  `${usuarioNuevo._id}.${extensionImagen}`;
                    
                        // Move file
                        const path = obtenerRutaDeCargaArchivos("fotografias", nameFile);
                        // Size file
                        let redimension = false;
                        if (file.size > 900000) {
                            redimenion = true;
                        } 
                        Subir.subirFotografia(usuarioNuevo._id, file.data, nameFile, redimension);
                    }
                        resolve({
                            data: usuarioNuevo
                        });
                    });

                });

        });
    }

    // Actualizar usuario - agregar un nuevo empleo
    static agregarEmpleo(id, empleo) {
        return new Promise((resolve, reject) => {
            if (!id) return reject({ msg: 'Petición incorrecta!, falta id de usuario.', code: 400 });
            if (!empleo) return reject({ msg: 'No data', code: 400 });

            // find user
            UsuarioModel.findByIdAndUpdate(id, { $addToSet: { empleos: empleo } }, { new: true })
                .exec((err, userUpdate) => {
                    if (err) return reject({ msg: 'Error server', err, code: 500 });
                    if (!userUpdate) return reject({ msg: 'Usuario no encontrado.', code: 400 });
                    resolve(userUpdate);
                });
        });
    }

    // Actualizar usuario - eliminar empleo
    static eliminarEmpleo(id, empleo) {
        return new Promise((resolve, reject) => {
            if (!id) return reject({ msg: 'Petición incorrecta!, falta id de usuario.', code: 400 });
            if (!empleo) return reject({ msg: 'No data', code: 400 });

            // find user
            UsuarioModel.findByIdAndUpdate(id, { $pull: { empleos: { _id: empleo } } }, { new: true })
                .exec((err, userUpdate) => {
                    if (err) return reject({ msg: 'Error server', err, code: 500 });
                    if (!userUpdate) return reject({ msg: 'Usuario no encontrado.', code: 400 });
                    resolve(userUpdate);
                });
        });
    }

    // Actualizar usuario - eliminar formacion
    static eliminarEstudio(id, idEstudio) {
        return new Promise((resolve, reject) => {
            if (!id) return reject({ msg: 'Petición incorrecta!, falta id de usuario.', code: 400 });
            if (!idEstudio) return reject({ msg: 'No data', code: 400 });

            // find user
            UsuarioModel.findByIdAndUpdate(id, { $pull: { estudios: { _id: idEstudio } } }, { new: true })
                .exec((err, userUpdate) => {
                    if (err) return reject({ msg: 'Error server', err, code: 500 });
                    if (!userUpdate) return reject({ msg: 'Usuario no encontrado.', code: 400 });
                    resolve(userUpdate);
                });
        });
    }

    // Actualizar usuario - agregar una nueva formación
    static agregarFormacion(id, estudio) {
        return new Promise((resolve, reject) => {
            if (!id) return reject({ msg: 'Petición incorrecta!, falta id de usuario.', code: 400 });
            if (!estudio) return reject({ msg: 'No data', code: 400 });

            // find user
            UsuarioModel.findByIdAndUpdate(id, { $addToSet: { estudios: estudio } }, { new: true })
                .exec((err, userUpdate) => {
                    if (err) return reject({ msg: 'Error server', err, code: 500 });
                    if (!userUpdate) return reject({ msg: 'Usuario no encontrado.', code: 400 });
                    resolve(userUpdate);
                });
        });
    }

    // Actualizar usuario
    static actualizar(id, data) {
        return new Promise((resolve, reject) => {
            if (!id) return reject({ msg: 'Petición incorrecta!, falta id de usuario.', code: 400 });
            if (!data) return reject({ msg: 'No data', code: 400 });

            // find user
            UsuarioModel.findById(id, (err, userDB) => {

                if (err) return reject({ msg: 'Error server', err, code: 500 });
                if (!userDB) return reject({ msg: 'Usuario no encontrado.', code: 400 });

                let fotoDBOld = userDB.foto;
                let curriculoPdfOld = userDB.curriculoPdf;
                let notificacionesLeidasOld = userDB.notificacionesLeidas;

                userDB = _.extend(userDB, _.pick(data, ['nombre', 'apellidos', 'email', 'password', 'numeroContacto', 'rfc', 'direccion', 'descripcion', 'foto', 'razonSocial', 'edad', 'genero', 'progreso', 'experienciaLaboral', 'licenciatura', 'fechaNacimientoDia', 'fechaNacimientoMes', 'fechaNacimientoAnio', 'logros', 'habilidades', 'userRole', 'empleos', 'estudios', 'perfilVerificado', 'habilidad1', 'habilidad2', 'habilidad3', 'logro1', 'logro2', 'logro3', 'matricula', 'anio_egreso', 'titulo', 'cedula', 'rfc', 'nombreContacto', 'sectorEmpresarial', 'cargoContacto', 'ubicacion', 'recuperacionPassword', 'notificacionesLeidas']));


                if (userDB.notificacionesLeidas == "undefined") {
                    userDB.notificacionesLeidas = notificacionesLeidasOld;
                }
                if (userDB.curriculoPdf == "undefined") {
                    userDB.curriculoPdf = curriculoPdfOld;
                }

                if (userDB.foto == "undefined") {
                    userDB.foto = fotoDBOld
                }

                if (data.password) {
                    userDB.password = bcrypt.hashSync(data.password, 10); // encrypt password
                }
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

    static actualizarContrasenia(email, password, recuperacion = false) {
        return new Promise((resolve, reject) => {
            if (!email) return reject({ msg: 'No data (email).', code: 400 });
            if (!password) return reject({ msg: 'No data (password).', code: 400 });

            UsuarioModel.findOne({ email: email })
                .populate('nombre')
                .exec((err, userDB) => {

                    if (err) return reject({ msg: 'Error db', err, code: 500 });
                    if (!userDB) return reject({ msg: 'Usuario no encontrado!!', code: 400 });

                    userDB.password = bcrypt.hashSync(password, 10); // encrypt password
                    if (recuperacion) {
                        userDB.recuperacionPassword = true;
                    } else {
                        userDB.recuperacionPassword = false;
                    }
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

    static login(email, password) {
        return new Promise((resolve, reject) => {
            if (!email) return reject({ msg: 'No data (email).', code: 400 });
            if (!password) return reject({ msg: 'No data (password).', code: 400 });

            UsuarioModel.findOne({ email: email })
                .populate('nombre')
                .exec((err, userDB) => {

                    if (err) return reject({ msg: 'Error db', err, code: 500 });
                    if (!userDB) return reject({ msg: 'Usuario no encontrado!!', code: 400 });

                    if (!bcrypt.compareSync(password, userDB.password))
                        return reject({ msg: 'Usuario y/ó contraseña incorrectos.', code: 400 });

                    userDB.password = ':)';

                    resolve(userDB);
                });
        });
    }

    // delete user
    static delete(userId) {
        return new Promise((resolve, reject) => {

            UsuarioModel.findByIdAndRemove(userId, (err, userDB) => {

                if (err) return reject({ msg: 'Error db', err, code: 500 });
                if (!userDB) return reject({ msg: 'Could not delete the user.', code: 500 });

                const NotificacionModel = require('../models/notificacion');
                const PostulacionModel = require('../models/postulacion');
                const VacanteModel = require('../models/vacante');

                try {
                    NotificacionModel.deleteMany({})
                        .or([{ para: userId }, { de: userId }])
                        .exec((err) => console.log(err));
                        PostulacionModel.deleteMany({})
                        .or([{ empresa: userId }, { usuario: userId }])
                        .exec((err) => console.log(err));
                        PostulacionModel.deleteMany({ empresa: userId })
                        .exec((err) => console.log(err));

                } catch (err) {
                    return reject({ msg: 'Could not delete the user.', code: 500 });
                };

                // Todos las posibles rutas que tenga el usuario
                let paths = [];
                paths.push(obtenerRutaDeCargaArchivos('comprobantesDomicilio', `${userId}.pdf`));
                paths.push(obtenerRutaDeCargaArchivos('cv', `${userId}.pdf`));
                paths.push(obtenerRutaDeCargaArchivos('cv', `Custom_${userId}.pdf`));
                paths.push(obtenerRutaDeCargaArchivos('fotografias', userDB.foto));
                paths.push(obtenerRutaDeCargaArchivos('INE', `${userId}.pdf`));
                paths.push(obtenerRutaDeCargaArchivos('RFC', `${userId}.pdf`));
                
                paths.forEach(path => {
                    // Eliminar archivos
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
            });

                resolve(userDB);
            });
        });
    }

}

module.exports = { Usuario }