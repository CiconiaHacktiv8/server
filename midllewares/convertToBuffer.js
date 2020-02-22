const buffer = require('../helpers/buffer')

module.exports = function(req,res,next) {
    const toBuffer = buffer(req.body.image)
    req.body.image = toBuffer
    next()
}