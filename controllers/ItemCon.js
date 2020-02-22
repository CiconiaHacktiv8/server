// model
const Item = require('../models/item')

class ItemCon {
  static findAll(req, res, next) {
    Item.find()
      .populate('ownerId', 'email')
      .then(data => {
        res.status(200).json(data)
      })
      .catch(next)
  }

  static findOne(req, res, next) {
    Item.findOne({
      _id: req.params.id,
    })
      .then(item => {
        res.status(200).json(item)
      })
      .catch(next)
  }

  static create(req, res, next) {
    req.body.ownerId = req.payload.id
    Item.create(req.body)
      .then(item => {
        res.status(201).json(item)
      })
      .catch(next)
  }

  static remove(req, res, next) {
    //cek cart dulu jangan lupa !!
    Item.findByIdAndDelete(req.params.id)
      .then(response => {
        res.status(200).json(response)
      })
      .catch(next)
  }

  static update(req, res, next) {
    Item.findOne({ _id: req.params.id, status: 'watch' })
      .then(data => {
        if (data) {
          return Item.findByIdAndUpdate(req.params.id, req.body)
        } else {
          throw { status: 400, message: 'status item is Travel' }
        }
      })
      .then(respone => {
        res.status(200).json(respone)
      })
      .catch(next)
  }

  static priceStatusUpdate(req, res, next) {
    Item.findOne({ _id: req.params.id, status: 'watch' })
      .then(data => {
        if (data) {
          return Item.findByIdAndUpdate(req.params.id, req.body)
        } else {
          throw { status: 400, message: 'status item is Travel' }
        }
      })
      .then(respone => {
        res.status(200).json(respone)
      })
      .catch(next)
  }
}

module.exports = ItemCon
