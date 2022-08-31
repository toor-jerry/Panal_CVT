const _ = require('underscore');
const UsuarioModel = require('../models/usuario');

const pdf = require("pdf-creator-node");
const fs = require('fs');
const path = require('path');
const base64Img = require('base64-img');
const base64ArrayBuffer = require('base64-arraybuffer');

const { storage, ref, getBytes} = require('../config/firebaseConfig')

class PDF {


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

    static generatePDF(idUser) {
        return new Promise((resolve, reject) => {
            UsuarioModel.findById(idUser, async(err, user) => {
                if (err) 
                    return reject({code: 500, err});
                

                if (!user) 
                    return reject({code: 400, err: 'User not found.'});
                
                let numeroContacto,
                    foto,
                    logoUaemex, empleos = [], estudios = [];
                    

                    user.empleos.forEach(empleo => 
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
                logoUaemex = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/logo_uaemex.png'))
                
                    const fotografiasRef = ref(storage, 'fotografias/' + idUser + '.img');
                   await getBytes(fotografiasRef)
                    .then(val => {
                        foto =  base64ArrayBuffer.encode(val)
                    })
                    .catch(err => console.log('No existe la foto'))

                if (user.numeroContacto) {
                    numeroContacto = base64Img.base64Sync(path.resolve(__dirname, '../utils/assets/movil.jpeg'))
                }
                console.log(_.pick(user.empleos, ['nombreEmpresa', 'puestoDesempenado', 'periodo', 'funciones']));
                const options = {
                    format: "A4",
                    orientation: "portrait",
                    border: "10mm",
                    header: {
                        height: "18mm",
                        contents: `<div style="text-align: center;">
                        Author: Panal del Trabajo
                        </div>`
                    },
                    "footer": {
                        "height": "20mm",
                        "contents": {
                            // first: '',
                            // 2: 'Second page', // Any page number is working. 1-based index
                            default: `
                            <div style="text-align: center;">
                            <span style="color: #444;">Página <b>{{page}}</span>/<span>{{pages}}</b></span>
                            </div>
                            `,
                            // fallback value
                            // last: 'Last Page'
                        }
                    }
                };

                const nameFile = `${idUser}.pdf`

                // Read HTML Template
                const html = fs.readFileSync(path.resolve(__dirname, '../utils/templateCVPDF.html'), 'utf8');
                let fechaNacimiento = user.fechaNacimientoDia || '';
                let licenciatura = user.licenciatura || '';
                if (fechaNacimiento !== '') {
                    fechaNacimiento = `${
                        user.fechaNacimientoDia
                    }/${
                        user.fechaNacimientoMes
                    }/${
                        user.fechaNacimientoAnio
                    }`;
                }

                if (licenciatura !== '') {
                    switch (licenciatura) {
                        case 'LIA': licenciatura = 'Licenciatura en Informática';
                            break;
                        case 'ICO': licenciatura = 'Ingeniería en Computación';
                            break;
                        case 'LCN': licenciatura = 'Licenciatura en Contaduría'; 
                        break;
                    case 'LPS': licenciatura = 'Licenciatura en Psicología'; 
                        break;
                    case 'LTU': licenciatura = 'Licenciatura en Turismo'; 
                        break;
                    case 'LDE': licenciatura = 'Licenciatura en Derecho'; 
                        break;
                    }
                }
                const document = {
                    html: html,
                    data: {
                        numeroContacto,
                        foto,
                        logoUaemex,

                        age: user.edad,
                        progress: user.progreso,
                        experienciaLaboral: user.experienciaLaboral,
                        name: user.nombre,
                        last_name: user.apellidos || '',
                        email: user.email || '',
                        domicile: user.direccion || '',
                        gender: user.genero || '',
                        date_birth: fechaNacimiento,
                        movil_phone: user.numeroContacto || '',
                        description: user.descripcion || '',
                        carrera: licenciatura || '',
                        logro1: user.logro1 || '',
                        logro2: user.logro2 || '',
                        logro3: user.logro3 || '',
                        habilidad1: user.habilidad1 || '',
                        habilidad2: user.habilidad2 || '',
                        habilidad3: user.habilidad3 || '',
                        empleos,
                        estudios
                    },
                    path: `${
                        this.pathResolveCV()
                    }/${user._id}.pdf`
                };

                let pathFile = `${
                    this.pathResolveCV()
                }/${user._id}.pdf`;
                if (fs.existsSync(pathFile)) {
                    fs.unlinkSync(pathFile);
                }
                console.log(path.resolve(__dirname, `../../../node_modules/phantomjs-prebuilt/bin/phantomjs`))
                pdf.create(document, options).then(res => {
                    console.log(res)
                    resolve(`${user._id}.pdf`);
                }).catch(error => {
                    console.error("No se pudo escribir" + error)
                    reject({code: 500, err});
                });
            });
        });
    }

    static pathResolveCV() {
        return path.resolve(__dirname, `./temp`);
    }
}


module.exports = {
    PDF
}
