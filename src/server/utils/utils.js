const uuid = require('uuid');

const response200 = (res, data = undefined) => {
    return res.status(200).json({
        ok: true,
        data
    });
}

const response201 = (res, data = undefined) => {
    return res.status(201).json({
        ok: true,
        data
    });
}

const response400 = (res, message = undefined, err = undefined) => {
    return res.status(400).json({
        ok: false,
        message: message || 'Bad Request.',
        errors: err
    });
}

const response401 = (res, message = undefined, err = undefined) => {
    return res.status(401).json({
        ok: false,
        message: message || 'Unauthorized.',
        errors: err
    });
}

const response403 = (res, message = undefined, err = undefined) => {
    return res.status(403).json({
        ok: false,
        message: message || 'Forbidden.',
        errors: err
    });
}

const response404 = (res, message = undefined, err = undefined) => {
    return res.status(404).json({
        ok: false,
        message: message || 'Not Found.',
        errors: err
    });
}

const response500 = (res, err, message = undefined) => {
    return res.status(500).json({
        ok: false,
        message: message || 'Internal Server Error',
        errors: err
    });
}
// return date today
const today = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;

const obtenerRutaDeCargaArchivos = (dirName, fileName) => `./uploads/${dirName}/${fileName}`;

const getHash = (salto) => {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(salto);
    return bcrypt.hashSync("B4c0/\/", salt);
}

module.exports = {
    response200,
    response201,
    response400,
    response401,
    response403,
    response404,
    response500,
    obtenerRutaDeCargaArchivos,
    today,
    getHash
}