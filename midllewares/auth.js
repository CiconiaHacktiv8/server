const User = require('../models/user')
const Travel = require('../models/travel')
const { verifyToken } = require('../helpers/jwt')

module.exports = {
  authenticate: function(req, res, next) {
    if (!req.headers.token) {
      throw { name: 'BadRequest', messages: ['Token is missing'] }
    }

    try {
      const payload = verifyToken(req.headers.token)

      User.findOne({ _id: payload.id }).then(user => {
        if (!user) {
          throw { name: 'BadRequest', messages: ['Bad token'] }
        }

        req.payload = payload
        next()
      })
    } catch (err) {
      next(err)
    }
  },
  authorizeTravel: function(req, res, next) {
    Travel.findOne({ _id: req.params.travelId })
      .then(travel => {
        if (!travel) {
          throw { name: 'NotFound', messages: ['Travel not found'] }
        }

        if (travel.userId != req.payload.id) {
          throw { name: 'NotAuthorize', messages: ['You are not authorzied'] }
        }
        next()
      })
      .catch(next)
  },
}
