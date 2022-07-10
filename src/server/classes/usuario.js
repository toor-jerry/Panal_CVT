
// Encrypt library
const bcrypt = require('bcryptjs');
const _ = require('underscore');

// Usuario model
const UsuarioModel = require('../models/usuario');
const { response500, response400, response200, response201 } = require('../utils/utils');

class Usuario {

    // search all users
    static findAll() {
        return new Promise((resolve, reject) => {

            UsuarioModel.find({})
                .lean()
                .populate('area')
                .sort('name')
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
    static buscaEmpresas(res, from, limit) {

        return new Promise((resolve, reject) => {
                UsuarioModel.find({ role: 'USER_ENTERPRISE' })
                .skip(from)
                .limit(limit)
                .lean()
                .exec((err, empresas) => {

                    if (err) reject({ msg: `No se pudo buscar las empresas.`, err, code: 500 });

                    UsuarioModel.countDocuments({ role: 'USER_ENTERPRISE' }, (err, count) => {

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

    // Crear un usuario
    static crear(data) {
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
                        contacto: data.contacto
                    };

                    // new model of user
                    let usuario = new UsuarioModel(body);

                    // data persist
                    usuario.save((err, usuarioNuevo) => {

                        if (err) return reject({ msg: 'Error db', err, code: 500 });
                        if (!usuarioNuevo) return reject({ msg: 'No se pudo crear el usuario.', code: 400 });

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
        UsuarioModel.findByIdAndUpdate(id, { $pull: { empleos: {_id : empleo} } }, { new: true })
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
        UsuarioModel.findByIdAndUpdate(id, { $pull: { estudios: {_id : idEstudio} } }, { new: true })
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
                
                userDB = _.extend(userDB, _.pick(data, ['nombre', 'apellidos', 'email', 'password', 'numeroContacto', 'rfc', 'direccion', 'descripcion', 'foto', 'razonSocial', 'edad', 'genero', 'progreso', 'experienciaLaboral', 'licenciatura', 'fechaNacimientoDia', 'fechaNacimientoMes', 'fechaNacimientoAnio', 'logros', 'habilidades', 'userRole', 'empleos', 'estudios', 'perfilVerificado']));
                
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
    static delete(user) {
        return new Promise((resolve, reject) => {

            UsuarioModel.findByIdAndRemove(user, (err, userDB) => {

                if (err) return reject({ msg: 'Error db', err, code: 500 });
                if (!userDB) return reject({ msg: 'Could not delete the user.', code: 500 });

                io.emit('delete-user-registered-admin', { data: userDB });
                resolve(userDB);
            });
        });
    }

}

module.exports = { Usuario }