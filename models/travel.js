const { Schema, model, models } = require('mongoose')

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
    validate: {
      validator: function(v) {
        return models.Travel.findOne({ userId: this.userId }).then(travel => {
          if (travel) return false
          return true
        })
      },
      msg: 'Cant make another travel',
    },
  },
  itemList: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
})

const travel = model('Travel', travelSchema)

module.exports = travel
