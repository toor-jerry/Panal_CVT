// return date today
const today = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;

const getHash = (salto) => {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(salto);
    return bcrypt.hashSync("B4c0/\/", salt);
}

module.exports = { today, getHash }