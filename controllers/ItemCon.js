// model
const Item = require('../models/item')
const Travel = require('../models/travel')

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
      .populate('ownerId', 'email name point')
      .populate('travelId')
      .then(item => {
        res.status(200).json(item)
      })
      .catch(next)
  }
  /* istanbul ignore next */
  static createFromWeb(req, res, next) {
    let travelResponse, itemResponse
    if (req.body.status === 'travel') {
      Travel.findOne({ userId: req.payload.id })
        .then(travel => {
          if (travel) {
            // di bikinin
            travelResponse = travel
            Item.create({
              ...req.body,
              image: req.body.image
                ? req.body.image
                : 'https://via.placeholder.com/150',
              travelId: travel.id,
              ownerId: req.payload.id,
              location: travel.locationFrom,
            })
              .then(item => {
                itemResponse = item
                travelResponse.itemList.push(item.id)
                return travelResponse.save({ validateBeforeSave: false })
              })
              .then(() => {
                res.status(201).json(itemResponse)
              })
              .catch(next)
          } else {
            // throw error
            throw { name: 'BadRequest', messages: ['You didnt have travel'] }
          }
        })
        .catch(next)
    } else {
      req.body.ownerId = req.payload.id
      Item.create({
        ...req.body,
        image: req.body.image
          ? req.body.image
          : 'https://via.placeholder.com/150',
      })
        .then(item => {
          res.status(201).json(item)
        })
        .catch(next)
    }
  }

  static create(req, res, next) {
    let travelResponse, itemResponse
    if (req.body.status === 'travel') {
      Travel.findOne({ userId: req.payload.id })
        .then(travel => {
          if (travel) {
            // di bikinin
            travelResponse = travel
            Item.create({
              ...req.body,
              image: req.body.image
                ? req.body.image
                : 'https://via.placeholder.com/150',
              travelId: travel.id,
              ownerId: req.payload.id,
              location: travel.locationFrom,
            })
              .then(item => {
                itemResponse = item
                travelResponse.itemList.push(item.id)
                return travelResponse.save({ validateBeforeSave: false })
              })
              .then(() => {
                res.status(201).json(itemResponse)
              })
              .catch(next)
          } else {
            // throw error
            throw { name: 'BadRequest', messages: ['You didnt have travel'] }
          }
        })
        .catch(next)
    } else {
      req.body.ownerId = req.payload.id
      Item.create({
        ...req.body,
        image: req.body.image
          ? req.body.image
          : 'https://via.placeholder.com/150',
      })
        .then(item => {
          res.status(201).json(item)
        })
        .catch(next)
    }
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
