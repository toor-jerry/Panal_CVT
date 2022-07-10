const express = require('express');
const { checkSession } = require('../middlewares/auth');
const path = require('path');
const fs = require('fs');

const { response404 } = require('../utils/utils');

const app = express();

app.get('/:colection/:file', checkSession, (req, res) => {

    const colection = req.params.colection;
    const file = req.params.file;

    const pathImg = path.resolve(__dirname, `../../../uploads/${ colection }/${file}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        response404(res);
    }

});

module.exports = app;