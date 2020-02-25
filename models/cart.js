const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
  travelId: {
    type: Schema.Types.ObjectId,
    ref: 'Travel',
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
  },
  quantity: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: [
      'open',
      'offered',
      'pending purchase',
      'pending verification',
      'pending delivery',
      'completed',
    ],
  },
  fixPrice: {
    type: Number,
  },
  invoiceId: {
    type: String,
    default: null,
  },
})

const cart = model('Cart', cartSchema)

module.exports = cart
