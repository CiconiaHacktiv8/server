const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'you must enter item name'],
  },
  price: {
    type: Number,
    required: [true, 'you must enter item price'],
    min: [1000, 'minimal price is 1000'],
  },
  quantity: {
    type: Number,
    min: [1, 'minimal quantity is 1'],
    default: 1,
  },
  image: {
    type: String,
    required: [true, 'you must enter item image'],
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  travelId: {
    type: Schema.Types.ObjectId,
    ref: 'Travel',
  },
  status: {
    type: String,
    validate: {
      validator: function(v) {
        if (v === 'travel' || v === 'watch') {
          return true
        } else {
          return false
        }
      },
      message: props => `you must enter with travel or watch`,
    },
    required: [true, 'you must enter item status'],
  },
  location: {
    type: String,
    required: [true, 'you must enter item location'],
  },
})

const Model = mongoose.model('Item', ItemSchema)
module.exports = Model
