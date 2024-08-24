const jwt = require('jsonwebtoken');

const authGenerateJwtToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE,
    });
}

module.exports = {
    authGenerateJwtToken
}