const User = require('../models/user')
const Travel = require('../models/travel')
const Item = require('../models/item')
const { verifyToken } = require('../helpers/jwt')

module.exports = {
  authenticate: function(req, res, next) {
    if (!req.headers.token) {
      throw { name: 'BadRequest', messages: ['Token is missing'] }
    }

    try {
      const payload = verifyToken(req.headers.token)

      User.findOne({ _id: payload.id })
        .then(user => {
          if (!user) {
            throw { name: 'BadRequest', messages: ['Bad token'] }
          }

          req.payload = payload
          next()
        })
        .catch(next)
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
  authorizeItem: function(req, res, next) {
    Item.findOne({ _id: req.params.id })
      .then(item => {
        if (!item) {
          throw { name: 'NotFound', messages: ['Item not found'] }
        }
        
        if (item.ownerId != req.payload.id) {
          console.log(typeof item.ownerId,'owner id')
          console.log(typeof req.payload.id, 'iki idneeeeeee')
          throw { name: 'ItemAuthorize', messages: ['Item are not authorize'] }
        }
        next()
      })
      .catch(next)
  },
}
