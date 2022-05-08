const express = require('express'); // express module
const app = express(); // aplication

const { Area } = require('../classes/area'); // Area class
const { Cite } = require('../classes/cite'); // Cite class

// home route
app.get('/', (req, res) => {
    res.render('home', {
        page: 'Inicio'
    })
});


// signup route
// app.get('/signup', async(req, res) => {
//     res.render('register', {
//         page: 'Registro',
//         areas: await Area.findAll()
//             .then(resp => resp.data)
//             .catch(() => [])
//     })
// });

// cite route
app.get('/cite', async(req, res) => {
    res.render('register_cite', {
        page: 'Registro de citas',
        areas: await Area.findAll()
            .then(resp => resp.data)
            .catch(() => []),
        cites: await Cite.findAllFisrtArea()
            .then(resp => resp.data)
            .catch(() => [])
    })
});

// login route
app.get('/login', (req, res) => {

    // delete session
    if (req.session.user) {
        req.session = null;
        res.locals = { user: null };
    }

    res.render('login', {
        page: 'Iniciar sesión'
    })
});

// contact route
app.get('/contact', (req, res) => {

    res.render('contact', {
        page: 'Contacto'
    })
});

// signin route
app.get('/signin', (req, res) => {

    res.render('signin', {
        page: 'Acceder'
    })
});

module.exports = app;