const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;

const postulacionSchema = new Schema({
    empleo: {
        type: Schema.Types.ObjectId,
        ref: 'Empleo',
        required: [true, "Empleo es requerido!"]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, "Usuario es requerido!"]
    }
});

postulacionSchema.plugin(sanitizer);
postulacionSchema.plugin(uniqueValidator, { message: 'La propiedad "{PATH}" debe ser única!!' });
module.exports = mongoose.model("Postulacion", postulacionSchema);