const Travel = require('../models/travel')
const Item = require('../models/item')
const addItemManually = require('../helpers/addItemManually')

class TravelController {
  static getAllTravels(req, res, next) {
    Travel.find()
      .populate('userId', 'name email point')
      .populate({
        path: 'itemList',
        populate: {
          path: 'ownerId',
          select: 'name email point',
        },
      })
      .then(travels => res.json(travels))
      .catch(next)
  }

  static async addNewTravel(req, res, next) {
    let itemListIds = []

    try {
      let travel = await Travel.create({
        userId: req.payload.id,
        locationFrom: req.body.locationFrom,
        locationTo: req.body.locationTo,
        departure: req.body.departure,
      })

      if (req.body.itemList && req.body.itemList.length > 0) {
        // masuk masukin item ke travel
        for (let i = 0; i < req.body.itemList.length; ++i) {
          let itemId = await addItemManually(
            req.body.itemList[i],
            req.payload.id,
            travel.id,
            travel.locationFrom,
            )

          itemListIds.push(itemId)
        }

        itemListIds = itemListIds.filter(id => id !== null)
        travel.itemList = itemListIds

        travel = await travel.save({ validateBeforeSave: false })
        
      }

      const newTravel = await Travel.findOne({ _id: travel.id }).populate(
        'userId',
        'name email point',
      )
      res.status(201).json(newTravel)
    } catch (err) {
      next(err)
    }
  }

  static getTravel(req, res, next) {
    Travel.findOne({ _id: req.params.travelId })
      .populate('userId', 'name email point')
      .populate({
        path: 'itemList',
        populate: { path: 'ownerId', select: 'name email point' },
      })
      .then(travel => res.json(travel))
      .catch(next)
  }

  static editTravel(req, res, next) {
    Travel.findOneAndUpdate({ _id: req.params.travelId }, req.body, {
      new: true,
    })
      .then(travel => res.json(travel))
      .catch(next)
  }

  static deleteTravel(req, res, next) {
    Travel.findByIdAndRemove(req.params.travelId)
      .then(travel => res.json(travel))
      .catch(next)
  }
}

module.exports = TravelController
