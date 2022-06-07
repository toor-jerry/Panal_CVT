// ==========================
// Verif session
// ==========================
const checkSession = (req, res, next) => {
    const usuario = req.session.usuario
    if (!usuario) { // if user session is not exists, redirect to login page
        return res.redirect('/');
    }
    // send user to view
    res.locals = { usuario: usuario };
    next();
}

// ==========================
// Verifica el usuario administrador
// ==========================
const checkAdminRole = (req, res, next) => {
    if (req.session.usuario.userRole === 'USER_ADMIN' || req.session.usuario.userRole === 'SUPER_USER') { // if user is admin
        return next();
    }

    return res.status(401).redirect('/');

}

// ==========================
// Verifica el super usuario
// ==========================
const checkSuperRole = (req, res, next) => {

    if (req.session.usuario.userRole === 'SUPER_USER') { // if user is admin
        return next();
    }

    return res.status(401).redirect('/');

}

// ==========================
// Verifica el usuario empresa
// ==========================
const checkEnterpriseRole = (req, res, next) => {
    if (req.session.usuario.userRole === 'USER_ENTERPRISE' || req.session.usuario.userRole === 'USER_ADMIN' || req.session.usuario.userRole === 'SUPER_USER') { // if user is empresa
        return next();
    }

    return res.status(401).redirect('/');

}


module.exports = { checkSession, checkAdminRole, checkSuperRole, checkEnterpriseRole }