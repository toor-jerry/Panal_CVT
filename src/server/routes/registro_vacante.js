const express = require('express'); // express module
const app = express(); // aplication

// Tipo de registro route
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