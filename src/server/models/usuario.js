const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const sanitizer = require('mongoose-sanitize');


const Schema = mongoose.Schema;

// Roles for users
const rolesValidos = {
    values: ['USER_ENTERPRISE', 'USER_PERSONAL', 'USER_ADMIN', 'SUPER_USER'],
    message: '{VALUE} rol no válido!!'
};

// Géneros válidos
const generoValido = {
    values: ['Hombre', 'Mujer'],
    message: '{VALUE} género no válido!!'
};

// Estatus de perfil
const estatusPerfil = {
    values: ['Verificado', 'No verificado', 'Rechazado'],
    message: '{VALUE} estatus no válido!!'
};

const sectorEmpresarial = {
    values: ['Privado', 'Público', 'Social'],
    message: '{VALUE} sector no válido!!'
};

const empleoSchema = new mongoose.Schema({
    nombreEmpresa: String,
    puestoDesempenado: String,
    periodo: String,
    funciones: String,
    salario: Number
});

const estudioSchema = new mongoose.Schema({
    nombreEscuela: String,
    nivelAcademico: String,
    periodo: String
});

// Schema definition
const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es requerido!"]
    },
    apellidos: {
        type: String
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
    numeroContacto: {
        type: String
    },
    nombreContacto: {
        type: String
    },
    cargoContacto: {
        type: String
    },
    ubicacion: {
        type: String
    },
    sectorEmpresarial: {
        type: String,
        enum: sectorEmpresarial
    },
    rfc: {
        type: String
    },
    direccion: {
        type: String
    },
    descripcion: {
        type: String
    },
    foto: {
        type: String
    },
    razonSocial: {
        type: String
    },
    edad: {
        type: Number
    },
    genero: {
        type: String,
        enum: generoValido
    },
    progreso: {
        type: String
    },
    experienciaLaboral: {
        type: String
    },
    licenciatura: {
        type: String
    },
    fechaNacimientoDia: {
        type: Number
    },
    fechaNacimientoMes: {
        type: Number
    },
    fechaNacimientoAnio: {
        type: Number
    },
    logro1: {
        type: String
    },
    logro2: {
        type: String
    },
    logro3: {
        type: String
    },
    habilidad1: {
        type: String
    },
    habilidad2: {
        type: String
    },
    habilidad3: {
        type: String
    },
    userRole: {
        type: String,
        required: true,
        default: "USER_PERSONAL",
        enum: rolesValidos
    },
    empleos: [{
        type: empleoSchema
    }],
    estudios: [{
        type: estudioSchema
    }],
    perfilVerificado: {
        type: String,
        required: true,
        default: "No verificado",
        enum: estatusPerfil
    },
    matricula: {
        type: String
    },
    anio_egreso: {
        type: Number
    },
    titulo: {
        type: String,
        default: "NO"
    },
    cedula: {
        type: String,
        default: "N/A"
    },
    curriculoPdf: {
        type: String
    },
    notificacionesLeidas: {
        type: Number,
        default: 0
    },
    recuperacionPassword: {
        type: Boolean,
    }
});

usuarioSchema.plugin(sanitizer);
// values uniques
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único!!'
});

usuarioSchema.methods.toJSON = function() {
    let usuario = this;
    let userObj = usuario.toObject();
    delete userObj.password;
    return userObj;
}

module.exports = mongoose.model("Usuario", usuarioSchema);