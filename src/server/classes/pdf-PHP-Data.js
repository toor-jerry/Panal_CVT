const _ = require('underscore');
const UsuarioModel = require('../models/usuario');

const pdf = require("pdf-creator-node");
const fs = require('fs');
const path = require('path');
const base64Img = require('base64-img');
const base64ArrayBuffer = require('base64-arraybuffer');

const { storage, ref, getBytes, existeFile, getFile} = require('../config/firebaseConfig')

class PDF {
    static getData(idUser) {
        return new Promise((resolve, reject) => {
            UsuarioModel.findById(idUser, async(err, user) => {
                if (err) 
                    return reject({code: 500, err});
                
                if (!user) 
                    return reject({code: 400, err: 'User not found.'});

                let dataUrl = '?';

                    dataUrl +=`nombre=${user.nombre}&`;
                    dataUrl +=`id=${user._id}&`;
                    dataUrl +=`email=${user.email}&`;

                    if (user.apellidos) {
                        dataUrl +=`apellidos=${user.apellidos}&`;
                    }
                    if (user.direccion) {
                        dataUrl +=`direccion=${user.direccion}&`;
                    }
                    if (user.descripcion) {
                        dataUrl +=`descripcion=${user.descripcion}&`;
                    }
                if (user.numeroContacto) {
                    dataUrl +=`numeroContacto=${user.numeroContacto}&`;
                }
                if (user.fechaNacimiento && fechaNacimiento !== '') {
                    dataUrl += `fechaNacimiento=${user.fechaNacimientoDia}/${user.fechaNacimientoMes}/${user.fechaNacimientoAnio}&`;
                }

                if (user.edad) {
                    dataUrl += `edad=${user.edad}&`;
                }

                if (user.genero) {
                    dataUrl += `genero=${user.genero}&`;
                }

                if (user.progreso) {
                    dataUrl += `progreso=${user.progreso}&`;
                }

                if (user.experienciaLaboral) {
                    dataUrl += `experienciaLaboral=${user.experienciaLaboral}&`;
                }

                if (user.matricula) {
                    dataUrl += `matricula=${user.matricula}&`;
                }

                if (user.titulo) {
                    dataUrl += `titulo=${user.titulo}&`;
                }
                if (user.cedula) {
                    dataUrl += `cedula=${user.cedula}&`;
                }



                 /*existeFile('fotografias',  user._id, '.img').then((response)=> {
                    if (response[0]) {
                            getFile('fotografias', user._id, '.img').then((res) => dataUrl +=`foto=${res}&`).catch((err) => console.log('No image'))
                        
                    }});*/

                if (user.licenciatura && user.licenciatura !== '') {
                    switch (user.licenciatura) {
                        case 'LIA': dataUrl +=`licenciatura='Licenciatura en Informática Administrativa'&`;
                            break;
                        case 'ICO': dataUrl +=`licenciatura='Ingeniería en Computación'&`;
                            break;
                        case 'LCN': dataUrl +=`licenciatura='Licenciatura en Contaduría'&`;
                        break;
                    case 'LPS': dataUrl +=`licenciatura='Licenciatura en Psicología'&`;
                        break;
                    case 'LTU': dataUrl +=`licenciatura='Licenciatura en Turismo'&`;
                        break;
                    case 'LDE': dataUrl +=`licenciatura='Licenciatura en Derecho'&`;
                        break;
                    }
                }
                    /*user.empleos.forEach(empleo => 
                        empleos.push({'nombreEmpresa':
                            empleo.nombreEmpresa, 
                            'puestoDesempenado': empleo.puestoDesempenado, 
                           'periodo': empleo.periodo, 
                            'funciones': empleo.funciones,
                            'salario': empleo.salario})
                    );

                    user.estudios.forEach(estudio => 
                        estudios.push({'nombreEscuela': estudio.nombreEscuela,
                        'nivelAcademico':  this.getNivelAcademico(estudio.nivelAcademico),
                        'periodo': estudio.periodo})
            );
                    const fotografiasRef = ref(storage, 'fotografias/' + idUser + '.img');
                   await getBytes(fotografiasRef)
                    .then(val => {
                        foto =  base64ArrayBuffer.encode(val)
                    })
                    .catch(err => console.log('No existe la foto'))

                    */
                resolve(dataUrl)
                })
            })
    
}

static getNivelAcademico(nivelAcademico) {
    switch (nivelAcademico) {
        case "1": 
            return 'Doctorado'
        case "2": 
            return 'Maestria'
        case "3": 
            return 'Postgrado'
        case "4": 
            return 'Licenciatura \ Ingeniería'
        case "5": 
            return 'Preparatoria'
        case "6": 
            return 'Secuandaria'
        case "7": 
            return 'Primaria'
        default:
            return 'Nivel académico';
    }
}
}


module.exports = {
    PDF
}
