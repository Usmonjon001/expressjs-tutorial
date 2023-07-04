const bcrypt = require('bcrypt');

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt)
}

const comparePassword = (pass, hash) => {
    return bcrypt.compareSync(pass, hash) 
}

module.exports = {
    hashPassword,
    comparePassword
}