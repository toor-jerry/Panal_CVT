const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const sanitizer = require('mongoose-sanitize');


const Schema = mongoose.Schema;

// Estatus de perfil
const estatusPerfil = {
    values: ['Verificado', 'No verificado', 'Rechazado'],
    message: '{VALUE} estatus no válido!!'
};

// Schema definition
const verificacionSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, "Usuario es requerido!"]
    },
    perfilVerificado: {
        type: String,
        required: true,
        default: "No verificado",
        enum: estatusPerfil
    }
});

verificacionSchema.plugin(sanitizer);
// values uniques
verificacionSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único!!'
});

module.exports = mongoose.model("Verificacion", verificacionSchema);