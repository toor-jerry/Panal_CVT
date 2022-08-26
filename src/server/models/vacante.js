const mongoose = require("mongoose");
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;

const rolesValidos = {
    values: ['USER_ENTERPRISE', 'USER_PERSONAL', 'USER_ADMIN', 'SUPER_USER'],
    message: '{VALUE} not role valid!!'
};


const vacanteSchema = new Schema({
    puesto: {
        type: String,
        required: [true, "Nombre del puesto es requerido!"]
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, "Empresa es requerido!"]
    },
    perfilCreacion: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    salario: {
        type: Number,
        required: [true, "Salario es requerido!"]
    },
    horarios: {
        type: String
    },
    funciones: {
        type: String
    },
    notas: {
        type: String
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

vacanteSchema.plugin(sanitizer);
module.exports = mongoose.model("Vacante", vacanteSchema);