const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// Roles for users
const rolesValids = {
    values: ['USER_ENTERPRISE', 'USER_PERSONAL', 'USER_ADMIN', 'SUPER_USER'],
    message: '{VALUE} rol no válido!!'
};

// Schema definition
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es requerido!"]
    },
    apellidos: {
        type: String,
        required: [false, "Los apellidos son requeridos!"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email es requerido!"]
    },
    password: {
        type: String,
        required: [true, "Password es requerido!"],
        minlength: [8, "Min length 8."]
    },
    contacto: {
        type: String
    },
    userRole: {
        type: String,
        required: true,
        default: "USER_PERSONAL",
        enum: rolesValids
    }
});

// values uniques
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único!!'
});

module.exports = mongoose.model("Usuario", usuarioSchema);