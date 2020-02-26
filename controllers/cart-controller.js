const Cart = require('../models/cart')
const Travel = require('../models/travel')
const Item = require('../models/item')

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

  static async getCartWithStatusOpen(req, res, next) {
    try {
      const carts = await Cart.find({ buyerId: req.payload.id, status: 'open' })
        .populate({
          path: 'travelId',
          populate: { path: 'itemList' },
        })
        .populate({
          path: 'itemId',
        })

      res.json(carts)
    } catch (err) {
      next(err)
    }
  }

  static getCartWithStatusOffered(req, res, next) {
    Cart.find({ buyerId: req.payload.id, status: 'offered' })
      .then(carts => res.json(carts))
      .catch(next)
  }

  static async getCartByTravel(req, res, next) {
    const travel = await Travel.findOne({ userId: req.payload.id })
    if (!travel) {
      res.json([])
    } else {
      const carts = await Cart.find({
        travelId: travel.id,
        status: 'pending verification',
      })
        .populate('buyerId', 'name email point')
        .populate({
          path: 'itemId',
          select: 'name price image status location',
          populate: {
            path: 'ownerId',
            select: 'name email point',
          },
        })

      res.json(carts)
    }
  }

  static async getAllCartByUser(req, res, next) {
    const result = {
      open: [],
      offered: [],
      pendingPurchase: [],
      pendingDelivery: [],
    }

    let travel, cart

    try {
      travel = await Travel.findOne({ userId: req.payload.id })

      if (!travel) {
        // cariin cart berdasarkan buyerId nya aja
        cart = await Cart.find({ buyerId: req.payload.id })
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

        result.offered = cart.filter(c => c.status === 'offered')
        result.pendingPurchase = cart.filter(
          c => c.status === 'pending purchase',
        )
        result.pendingDelivery = cart.filter(
          c => c.status === 'pending delivery',
        )
        result.pendingDelivery = [
          ...result.pendingDelivery,
          ...cart.filter(c => c.status === 'pending verification'),
        ]

        res.json(result)
      } else {
        // cariin cart berdasarkan travelId dan juga berdasarkan buyerId
        cart = await Cart.find({ travelId: travel.id, status: 'open' })
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

        result.open = cart

        cart = await Cart.find({ buyerId: req.payload.id })
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

        result.offered = cart.filter(c => c.status === 'offered')
        result.pendingPurchase = cart.filter(
          c => c.status === 'pending purchase',
        )
        result.pendingDelivery = cart.filter(
          c => c.status === 'pending delivery',
        )
        result.pendingDelivery = [
          ...result.pendingDelivery,
          ...cart.filter(c => c.status === 'pending verification'),
        ]

        res.json(result)
      }
    } catch (err) {
      next(err)
    }
  }

  static async addNewCart(req, res, next) {
    /*
     * 1. cek status
     * 2. nyari item
     * 3. nyari travel
     * 4. jika travel ngga ketemu throw error
     * 5. item location sama ngga sama travel locationFrom
     * 6. jika beda jelas dong trhow error
     * 7. jika sama baru di bikinin cart
     * 8. travelid nya dari travel
     * 9. buyerId dari item.ownerId
     */
    if (req.body.status === 'offered') {
      const item = await Item.findOne({ _id: req.body.itemId })
      const travel = await Travel.findOne({ userId: req.payload.id })

      if (!travel) {
        return next({ name: 'BadRequest', messages: ['You didnt have travel'] })
      }

      let locations = item.location.split(',')
      let locationsFrom = travel.locationFrom.split(',')

      if (
        locations[locations.length - 1].trim().toLowerCase() !==
        locationsFrom[locationsFrom.length - 1].trim().toLowerCase()
      ) {
        return next({
          name: 'BadRequest',
          messages: ['Item location different'],
        })
      }

      const cart = await Cart.create({
        travelId: travel.id,
        buyerId: item.ownerId,
        itemId: item.id,
        quantity: item.quantity,
        status: 'offered',
        fixPrice: req.body.fixPrice,
      })

      res.status(201).json(cart)
    } else {
      const cart = await Cart.create({
        travelId: req.body.travelId,
        buyerId: req.payload.id,
        itemId: req.body.itemId,
        quantity: req.body.quantity,
        status: req.body.status,
        fixPrice: req.body.fixPrice,
      })

      res.status(201).json(cart)
    }
  }

  static async editCart(req, res, next) {
    /*
     * cari cart dulu
     * cek status nya offered atau bukan
     * kalau bukan langsung pakai yang sekarang
     * kalau statusnya offered cek status yang di bawa dari client
     * kalau status nya pending purchase update lagi pakai yang sekarang
     * item nya juga di update
     * item nya di masukin ke itemList di travel
     * kalau bukan cart nya di delete
     */
    try {
      let cart, updatedCart, item, travel
      cart = await Cart.findOne({ _id: req.params.cartId })

      if (cart.status !== 'offered') {
        updatedCart = await Cart.findOneAndUpdate(
          { _id: req.params.cartId },
          req.body,
          { new: true },
        )
        res.json(updatedCart)
      } else {
        if (req.body.status === 'pending purchase') {
          cart = await Cart.findOneAndUpdate(
            { _id: req.params.cartId },
            req.body,
            { new: true },
          )
          item = await Item.findOneAndUpdate(
            { _id: cart.itemId },
            {
              price: cart.fixedPrice,
              status: 'travel',
              travelId: cart.travelId,
            },
            { new: true },
          )
          travel = await Travel.findOne({ _id: cart.travelId })
          travel.itemList.push(item.id)
          await travel.save({ validateBeforeSave: false })

          res.json(cart)
        } else {
          cart = await Cart.findByIdAndRemove(req.params.cartId)
          res.json(cart)
        }
      }
    } catch (err) {
      next(err)
    }

    // Cart.findOneAndUpdate({ _id: req.params.cartId }, req.body, { new: true })
    // .then(cart => res.json(cart))
    // .catch(next)
  }

  static deleteCart(req, res, next) {
    Cart.findByIdAndRemove(req.params.cartId)
      .then(cart => res.json(cart))
      .catch(next)
  }
}

module.exports = CartController
