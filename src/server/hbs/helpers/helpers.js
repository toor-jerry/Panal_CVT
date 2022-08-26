const hbs = require('express-hbs'); // HBS

// return name enterprise
hbs.registerHelper('name_enterprise', () => process.env.NAME_ENTERPRISE);

// return anio
hbs.registerHelper('anio', () => new Date().getFullYear());

// return month
hbs.registerHelper('month', () => new Date().getMonth() + 1);

// return day
hbs.registerHelper('day', () => new Date().getDate());

// return true if user is admin
hbs.registerHelper('admin', (role) => (role === 'ADMIN_ROLE') ? true : false);

// equals
hbs.registerHelper('ifeq', (a, b) => (a == b) ? true : false );
// equals
hbs.registerHelper('ifdiff', (a, b) => (a !== b) ? true : false );

// equals
hbs.registerHelper('mostrarNotificaciones', (notificacionesTotales, notificacionesLeidas) => (notificacionesLeidas && (notificacionesTotales - notificacionesLeidas) != 0) ? true : false );

// es igual a la vacante 
hbs.registerHelper('ifeq_vacante', (vacanteId, postulaciones) => {
    let status = '';
    postulaciones.forEach(postulacion => {
        if (postulacion.vacante._id.toString() == vacanteId.toString()) {
            status = postulacion.status;
        }
    }   // end forEach
    ); // end forEach
    return status;
} );

//  
hbs.registerHelper('fechaPostulacion', (vacanteId, postulaciones) => {
    let fecha;
    postulaciones.forEach(postulacion => {
        if (postulacion.vacante._id.toString() == vacanteId.toString()) {
            fecha = postulacion.fechaPostulacion.toLocaleDateString();
        }
    }   // end forEach
    ); // end forEach
    return fecha;
} );

// mayor
hbs.registerHelper('esMayor', (a, b) => (a > b) ? true : false );

// menor o igual
hbs.registerHelper('esMenorIgual', (a, b) => (a <= b) ? true : false );

// longitud
hbs.registerHelper('longitudArreglo', a => a.length );

// negacion
hbs.registerHelper('negacion', a => !a);

// Suma
hbs.registerHelper('suma', (a,b) => (Number(a) + Number(b)));

// Resta
hbs.registerHelper('resta', (a,b) => (Number(a) - Number(b)));