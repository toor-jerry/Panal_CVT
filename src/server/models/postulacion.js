const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Estatus de perfil
const estatusPerfil = {
    values: ['En proceso', 'Rechazado'],
    message: '{VALUE} estatus no válido!!'
};

const postulacionSchema = new Schema({
    empresa: {
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    },
    vacante: {
        type: Schema.Types.ObjectId,
        ref: 'Vacante',
        required: [true, "Vacante es requerida!"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, "Usuario es requerido!"]
    },
    fechaPostulacion: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        default: "En proceso",
        enum: estatusPerfil

    }
});

module.exports = mongoose.model("Postulacion", postulacionSchema);