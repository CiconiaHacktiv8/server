const jwt = require('jsonwebtoken')


function generateToken (user) {
    let encoded = jwt.sign({user}, process.env.JWT_SECRET)
    return encoded
    }
function verifyToken (token) {
    return jwt.verify(token, process.env.JWT_SECRET)
    }

module.exports = {
    generateToken,
    verifyToken
}