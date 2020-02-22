const Cart = require('../models/cart')

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
