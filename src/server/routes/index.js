// express
const express = require('express');

// initialization express
const app = express();

// routes definitions
const appRoutes = require('./app');
const usuarioRoutes = require('./usuario');
const registroRoutes = require('./registro');
const perfilRoutes = require('./perfil');
const cvRoutes = require('./cv');
const postulacionRoutes = require('./postulacion');
const vacanteRoutes = require('./vacante');
const correoRoutes = require('./mailer');
const archivosRoutes = require('./archivos');
const pdfRoutes = require('./pdf');

// Routes
app.use('/', appRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/registro', registroRoutes);
app.use('/perfil', perfilRoutes);
app.use('/cv', cvRoutes);
app.use('/postulacion', postulacionRoutes);
app.use('/vacante', vacanteRoutes);
app.use('/correo', correoRoutes);
app.use('/archivos', archivosRoutes);
app.use('/pdf', pdfRoutes);

// 404
app.use((req, res, next) => {
    res.status(404).render("404", {
        page: '404'
    })
})

module.exports = app;