const { Schema, model } = require('mongoose')

const travelSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  locationFrom: {
    type: String,
    required: [true, 'locationFrom is missing'],
  },
  locationTo: {
    type: String,
    required: [true, 'locationTo is missing'],
  },
  departure: {
    type: Date,
    required: [true, 'departure is missing'],
  },
})

const travel = model('Travel', travelSchema)

module.exports = travel
