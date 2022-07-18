const express = require('express');
const { checkSession } = require('../middlewares/auth');

const { PDF } = require('../classes/pdf');
const fs = require('fs');
const path = require('path');
const { response404 } = require('../utils/utils');
const app = express();

app.get('/', checkSession, (req, res) => {
    PDF.generatePDF(req.session.usuario._id)
        .then(fileName => {
            const pathPdf = path.resolve(__dirname, `../../../uploads/cv/${ fileName }`);


            if (fs.existsSync(pathPdf)) {
                res.set({
                    "Content-Type": "application/pdf"
                });
                 res.sendFile(pathPdf);

            } else {
                response404(res);
            }
        })
        .catch(err => res.status(err.code).json(err.err));
});


module.exports = app;