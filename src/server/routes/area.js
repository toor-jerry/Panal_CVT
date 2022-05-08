// express
const express = require('express');

const { Area } = require('../classes/area'); // Area class
const { Cite } = require('../classes/cite'); // Cite class

const { checkSession, checkAdminRole } = require('../middlewares/auth'); // midlewares auth

// express initialization
const app = express();

// utils 
const { today } = require('../utils/utils');

// ==========================
// Get all areas
// ==========================
app.get('/all', checkSession, async(req, res) => {

    res.status(200).render('dashboard_areas', {
        page: 'Dashboard | Areas',
        areas: await Area.findAll()
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),

        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => [])
    })
});

// ==========================
// Create a area
// ==========================
app.post('/', [checkSession, checkAdminRole], (req, res) =>

    Area.create(req.body)
    .then(() => res.status(201).json({}))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

);

// ==========================
// Delete a area by Id
// ==========================
app.delete('/:id', [checkSession, checkAdminRole], (req, res) =>

    Area.delete(req.params.id)
    .then(() => res.status(200).json({}))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

);


module.exports = app;