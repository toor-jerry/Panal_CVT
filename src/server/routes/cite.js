// express
const express = require('express');

// cite class
const { Cite } = require('../classes/cite');

const { checkSession } = require('../middlewares/auth'); // midleware auth

const app = express(); // express initialization

// return today date
const { today } = require('../utils/utils');

// ==========================
// Get all cites by area
// ==========================
app.get('/all', checkSession, async(req, res) => {
    res.render('dashboard_cites', {
        page: 'Dashboard | Citas',
        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => [])
    })
});

// ==========================
// Get all cites by area
// ==========================
app.get('/hours/:area/:date', (req, res) =>

    Cite.findAllByDate(req.params.area, req.params.date)
    .then(resp => res.status(200).json({ data: resp.data }))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

);

app.get('/show/:cite', checkSession, async(req, res) => {

    res.status(200).render('dashboard_cite', {
        page: 'Dashboard | Citas',
        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => []),
        cite: await Cite.findById(req.params.cite)
            .then(resp => resp.data)
            .catch(err => res.status(err.code).render('404', { page: '404', err }))
    })
});


// ==========================
// Create cite
// ==========================
app.post('/', (req, res) =>

    Cite.create(req.body)
    .then(() => res.status(201).json({}))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

);

// ==========================
// Delete cite by Id
// ==========================
app.delete('/:id', checkSession, (req, res) => {

    Cite.delete(req.params.id)
        .then(() => res.status(200).json({}))
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

});


module.exports = app;