const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Estatus de perfil
const tiposNotificacion = {
    values: ['Personal', 'Todos'],
    message: '{VALUE} tipo no válido!!'
};

const notifacionSchema = new Schema({
    de: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    para: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    titulo: {
        type: String
    },
    mensaje: {
        type: String
    },
    fechaNotificacion: {
        type: Date,
        default: Date.now
    },
    tipo: {
        type: String,
        required: true,
        default: "Todos",
        enum: tiposNotificacion

    }
});

module.exports = mongoose.model("Notificacion", notifacionSchema);