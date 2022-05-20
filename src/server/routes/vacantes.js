const express = require('express'); // express module
const app = express(); // aplication

// Creación vacante
app.get('/creacion', (req, res) => {
    let id = req.params.id;
    res.render('creacion_vacante', {
        page: 'Creación',
        nombre_boton_navbar: 'Creación de Vacante',

        nombre: 'Farmacias Guadalajara',
        razon_social: 'FRAGUA SA de CV',
        foto: 'https://www.yo-local.com/sites/default/files/imagen_negocio/1_150.jpg',
        descripcion: 'Empresa de procesado de medicamentos.',
        direccion: 'Calle villa de Tezontepec',


        vacantes: [
            {nombre_empresa: 'Farmacias Guadalajara', foto_empresa: 'https://www.yo-local.com/sites/default/files/imagen_negocio/1_150.jpg', descripcion_vacante: 'Se solicita desarrollador de IOS para la creación de aplicaciones IOS.'},
            {nombre_empresa: 'Grupo Salinas', foto_empresa: 'https://indicepolitico.com/wp-content/uploads/2019/10/gruposalinas-foto_cortesia_internet.jpg', descripcion_vacante: 'Se solicita desarrollador de Android para la creación de aplicaciones Android.'}
        ]
    })
});



// Tipo de registro route (postulacion a vacante)
app.get('/:id', (req, res) => {
    let id = req.params.id;
    res.render('registro_vacante', {
        page: 'Postulacion',
        nombre_boton_navbar: 'Información de la vacante',
        direccion_link_boton_navbar: '/perfil',
        mostrar_boton_regreso: true,
        empresa: {
            nombre: 'Farmacias Guadalajara',
            razon_social: 'Cedis Centro Fragu SA de CV',
            foto_empresa: 'https://www.yo-local.com/sites/default/files/imagen_negocio/1_150.jpg',
            correo: 'fragia@gmail.com',
            telefono: '55235345345',
            descripcion_empresa: 'Empresa farmaceutica',
        },
        vacante: {
            puesto: 'Diseñador',
            horarios: 'Lunes - Viernes',
            funciones: 'Diseñar el logo de la empresa',
            notas: 'Se descansa fines de semana',
            salario: '6,000 MXN'
        }
    })
});


module.exports = app;