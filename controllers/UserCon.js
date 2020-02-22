//models
const User = require('../models/user')

//token & commpare password
const { comparePassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class UserCon {
  static login(req, res, next) {
    const errors = []

    if (!req.body.email) errors.push('Missing email')
    if (!req.body.password) errors.push('Missing password')

    if (errors.length > 0) {
      next({ name: 'BadRequest', messages: errors })
    }

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          throw { name: 'BadRequest', messages: ['Email or password is wrong'] }
        }

        if (!comparePassword(req.body.password, user.password)) {
          throw { name: 'BadRequest', message: ['Email or password is wrong'] }
        }

        const token = generateToken({ id: user.id })

        res.json({
          token,
          name: user.name,
          email: user.email,
          point: user.point,
        })
      })
      .catch(next)
  }

  static register(req, res, next) {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then(user => {
        const token = generateToken({ id: user.id })

        res.status(201).json({
          token,
          name: user.name,
          email: user.email,
          point: user.point,
        })
      })
      .catch(next)
  }
}

module.exports = UserCon
