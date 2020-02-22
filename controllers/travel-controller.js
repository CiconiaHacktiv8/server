const Travel = require('../models/travel')

class TravelController {
  static getAllTravels(req, res, next) {
    Travel.find()
      .then(travels => res.json(travels))
      .catch(next)
  }

  static addNewTravel(req, res, next) {
    Travel.create({
      userId: req.payload.id,
      locationFrom: req.body.locationFrom,
      locationTo: req.body.locationTo,
      departure: req.body.departure,
    })
      .then(travel => res.status(201).json(travel))
      .catch(next)
  }

  static getTravel(req, res, next) {
    Travel.findOne({ _id: req.params.travelId })
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
