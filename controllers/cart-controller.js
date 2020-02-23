const Cart = require('../models/cart')
const Travel = require('../models/travel')

class CartController {
  static getAllCarts(req, res, next) {
    Cart.find()
      .then(carts => res.json(carts))
      .catch(next)
  }

  static getCart(req, res, next) {
    Cart.findOne({ _id: req.params.cartId })
      .then(cart => res.json(cart))
      .catch(next)
  }

  static getCartWithStatusOpen(req, res, next) {
    Travel.findOne({ userId: req.payload.id })
      .then(travel => {
        if (!travel) {
          throw { name: 'NotFound', messages: ['Travel not found'] }
        }

        return Cart.find({ travelId: travel.id, status: 'open' })
      })
      .then(carts => res.json(carts))
      .catch(next)
  }

  static getCartWithStatusOffered(req, res, next) {
    Cart.find({ buyerId: req.payload.id, status: 'offered' })
      .then(carts => res.json(carts))
      .catch(next)
  }

  static getAllCartByUser(req, res, next) {
    const result = {
      open: [],
      offered: [],
      pendingPurchase: [],
      pendingDelivery: [],
    }

    Travel.findOne({ userId: req.payload.id })
      .then(travel => {
        if (!travel) {
          throw { name: 'NotFound', messages: ['Travel not found'] }
        }

        return Cart.find({ travelId: travel.id, status: 'open' })
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
      })
      .then(carts => {
        result.open = carts

        return Cart.find({ buyerId: req.payload.id })
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
      })
      .then(carts => {
        result.offered = carts.filter(cart => cart.status === 'offered')
        result.pendingPurchase = carts.filter(
          cart => cart.status === 'pending purchase',
        )
        result.pendingDelivery = carts.filter(
          cart => cart.status === 'pending delivery',
        )

        res.json(result)
      })
      .catch(next)
  }

  static addNewCart(req, res, next) {
    Cart.create({
      travelId: req.body.travelId,
      buyerId: req.payload.id,
      itemId: req.body.itemId,
      quantity: req.body.quantity,
      status: req.body.status,
      fixPrice: req.body.fixPrice,
    })
      .then(cart => res.json(cart))
      .catch(next)
  }

  static editCart(req, res, next) {
    Cart.findOneAndUpdate({ _id: req.params.cartId }, req.body, { new: true })
      .then(cart => res.json(cart))
      .catch(next)
  }

  static deleteCart(req, res, next) {
    Cart.findByIdAndRemove(req.params.cartId)
      .then(cart => res.json(cart))
      .catch(next)
  }
}

module.exports = CartController
