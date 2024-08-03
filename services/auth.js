const JWT = require('jsonwebtoken');

const secretKey = "SVNIT";

function createToken(user){
    const payload = {
        _id:user._id,
        username:user.username,
        email:user.email,
        role:user.role
    }

    const token = JWT.sign(payload,secretKey);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token,secretKey);
    return payload;
}

module.exports = {createToken,validateToken};