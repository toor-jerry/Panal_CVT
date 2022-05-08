const express = require('express'); // express

const { checkSession, checkAdminRole } = require('../middlewares/auth'); // midlewares auth

const { Cite } = require('../classes/cite'); // Cite class
const { Area } = require('../classes/area'); // Area class

// utils 
const { today } = require('../utils/utils');

// express initialization
const app = express();


// dashboard route
app.get('/', checkSession, async(req, res) => {
    res.render('dashboard', {
        page: 'Dashboard',
        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => [])
    })
});

// create account only admin
app.get('/create/account', [checkSession, checkAdminRole], async(req, res) => {
    res.render('dashboard_create_user', {
        page: 'Registro',
        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => []),
        areas: await Area.findAll()
            .then(resp => resp.data)
            .catch(() => [])
    })
});


module.exports = app;