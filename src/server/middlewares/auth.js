// ==========================
// Verif session
// ==========================
const checkSession = (req, res, next) => {

    if (!req.session.user) { // if user session is not exists, redirect to login page
        return res.redirect('/login');
    }

    // send user to view
    res.locals = { user: req.session.user };

    next();
}

// ==========================
// Verif admin role
// ==========================
const checkAdminRole = (req, res, next) => {

    if (req.session.user.role === 'ADMIN_ROLE') { // if user is admin
        return next();
    }

    return res.status(401).redirect('/dashboard');

}

module.exports = { checkSession, checkAdminRole }