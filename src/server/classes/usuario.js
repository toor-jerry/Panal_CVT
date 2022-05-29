// Encrypt library
const bcrypt = require('bcryptjs');

// Usuario model
const UsuarioModel = require('../models/usuario');

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
                .populate('area')
                .exec((err, user) => {

                    if (err) reject({ msg: `Could not found user.`, err, code: 500 });
                    if (!user) reject({ msg: `User not found.`, code: 400 });

                    resolve({ data: user });

                });
        });
    }

    // create user
    static create(data) {
        return new Promise((resolve, reject) => {
            if (!data) return reject({ msg: 'No data', code: 400 });

            // unique email
            UsuarioModel.findOne({ email: data.email })
                .exec((err, userDB) => {

                    if (err) return reject({ msg: 'Error db', err, code: 500 });
                    if (userDB) return reject({ msg: 'Email wold be unique', code: 400 });

                    // data definiticion
                    let body = {
                        name: data.name,
                        last_name: data.last_name,
                        email: data.email,
                        password: bcrypt.hashSync(data.password, 10), // encrypt password
                        role: data.role,
                        area: data.area
                    };

                    // new model of user
                    let user = new UsuarioModel(body);

                    // data persist
                    user.save((err, userCreated) => {

                        if (err) return reject({ msg: 'Error db', err, code: 500 });
                        if (!userCreated) return reject({ msg: 'Could not create the user.', code: 400 });

                        io.emit('new-user-registered-admin', { data: userCreated });
                        resolve(userCreated);
                    });

                });

        });
    }

    // update user
    static update(id, data) {
        return new Promise((resolve, reject) => {
            if (!id) return reject({ msg: 'No user', code: 400 });
            if (!data) return reject({ msg: 'No data', code: 400 });

            // find user
            UsuarioModel.findById(id, (err, userDB) => {

                if (err) return reject({ msg: 'Error server', err, code: 500 });
                if (!userDB) return reject({ msg: 'User not found', code: 400 });

                userDB.name = data.name;
                userDB.last_name = data.last_name;
                if (data.password) {
                    userDB.password = bcrypt.hashSync(data.password, 10); // encrypt password
                }
                userDB.role = data.role;
                userDB.area = data.area;
                // data persist
                userDB.save((err, userUpdate) => {
                    console.log(err);
                    if (err) return reject({ msg: 'Error db', err, code: 500 });
                    if (!userUpdate) return reject({ msg: 'Could not update the user.', code: 400 });

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