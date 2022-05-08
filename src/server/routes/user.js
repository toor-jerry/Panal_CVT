// express
const express = require('express');

const { User } = require('../classes/user'); // user class
const { Cite } = require('../classes/cite'); // cite class
const { Area } = require('../classes/area'); // area class

const { checkSession, checkAdminRole } = require('../middlewares/auth'); // midlewares auth

// express initialization
const app = express();

const { today } = require('../utils/utils');

// ==========================
// Get all users
// ==========================
app.get('/all', [checkSession, checkAdminRole], async(req, res) => {
    res.status(200).render('dashboard_users', {
        page: 'Dashboard | Usuarios',
        users: await User.findAll()
            .then(resp => resp.data)
            .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err })),
        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => [])
    })

});

// ==========================
// Create a user
// ==========================
app.post('/', [checkSession, checkAdminRole], (req, res) =>

    User.create(req.body)
    .then(() => res.status(201).json({}))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

);


// ==========================
// Update view
// ==========================
app.get('/edit/:id', [checkSession, checkAdminRole], async(req, res) => {
    res.render('dashboard_user', {
        page: 'Usuario | Editar',
        cites: await Cite.findAllByAreaAndDate(req.session.user.area._id, today)
            .then(resp => resp.data)
            .catch(() => []),
        user_edit: await User.findById(req.params.id)
            .then(resp => resp.data)
            .catch(() => []),
        areas: await Area.findAll()
            .then(resp => resp.data)
            .catch(() => [])
    })
});

// ==========================
// Update user
// ==========================
app.put('/edit/:id', [checkSession, checkAdminRole], (req, res) =>

    User.update(req.params.id, req.body)
    .then(() => res.status(200).json({}))
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

);

// ==========================
// Delete a user by Id
// ==========================
app.delete('/:id', [checkSession, checkAdminRole], (req, res) => {

    User.delete(req.params.id)
        .then(() => res.status(200).json({}))
        .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))

});

// ==========================
// Login
// ==========================
app.post('/login', (req, res) =>

    User.login(req.body.email, req.body.password)
    .then(user => {
        // session register
        req.session.user = user;
        res.status(200).json({ data: user });
    })
    .catch(err => res.status(err.code).json({ msg: err.msg, err: err.err }))
);

module.exports = app;