const express = require('express'); // express module
const app = express(); // aplication

// home route (Cierra sesión)
app.get('/', (req, res) => {
    // delete session
    if (req.session.usuario) {
        req.session = null;
        res.locals = { usuario: null };
    }

    res.render('home', {
        page: 'Inicio',
        archivoJS: 'function_login.js'
    })
});

module.exports = app;