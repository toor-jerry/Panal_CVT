const mongoose = require("mongoose");
const sanitizer = require('mongoose-sanitize');

const Schema = mongoose.Schema;

const rolesValidos = {
    values: ['USER_ENTERPRISE', 'USER_PERSONAL', 'USER_ADMIN', 'SUPER_USER'],
    message: '{VALUE} not role valid!!'
};

const vacantesValidos = {
    values: ['Servicio social', 'Practicas profesionales', 'Laboral', 'Estancias profesionales'],
    message: '{VALUE} not vacante valid!!'
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
        type: Number
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
    },
    tipoVacante: {
        type: String,
        required: true,
        default: "Laboral",
        enum: vacantesValidos
    }
});

vacanteSchema.plugin(sanitizer);
module.exports = mongoose.model("Vacante", vacanteSchema);