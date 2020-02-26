//models
const User = require('../models/user')
const Item = require('../models/item')
const Travel = require('../models/travel')
const Cart = require('../models/cart')

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
          throw { name: 'BadRequest', messages: ['Email or password is wrong'] }
        }

        const token = generateToken({ id: user.id, email: user.email })

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
        const token = generateToken({ id: user.id, email: user.email })

        res.status(201).json({
          token,
          name: user.name,
          email: user.email,
          point: user.point,
        })
      })
      .catch(next)
  }

  static async getUserDetail(req, res, next) {
    const result = {
      items: [],
      carts: [],
      travel: null,
      user: null,
    }
    let carts

    try {
      const items = await Item.find({ ownerId: req.payload.id })
        .populate({
          path: 'ownerId',
          select: 'name email point',
        })
        .populate({
          path: 'travelId',
          populate: {
            path: 'itemList',
          },
        })

      result.items = items

      const travel = await Travel.findOne({ userId: req.payload.id })
        .populate({
          path: 'itemList',
          populate: {
            path: 'ownerId',
            select: 'name email point',
          },
        })
        .populate({
          path: 'userId',
          select: 'name email point',
        })

      result.travel = travel

      carts = await Cart.find({ buyerId: req.payload.id })
        .populate('buyerId', 'name email point')
        .populate({
          path: 'itemId',
          populate: { path: 'ownerId', select: 'name email point' },
        })
        .populate({
          path: 'travelId',
          select: 'locationFrom locationTo departure userId',
          populate: { path: 'userId', select: 'name email point' },
        })

      result.carts = carts

      result.user = await User.findOne(
        { _id: req.payload.id },
        'name email point',
      )

      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserCon
