const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postulacionSchema = new Schema({
    vacante: {
        type: Schema.Types.ObjectId,
        ref: 'Vacante',
        required: [true, "Vacante es requerida!"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, "Usuario es requerido!"]
    }
});

module.exports = mongoose.model("Postulacion", postulacionSchema);