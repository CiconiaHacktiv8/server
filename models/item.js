const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
const ItemSchema = new Schema({
    name: {
        type:String,
        required:[true,'you must enter your name']
    },
    price: {
        type:Number,
        required:[true,'you must enter your price'],
        min:[1000,'minimal price is 1000']
    },
    quantity: {
        type:Number,
        required:[true,'you must enter your quantity'],
        min:[1,'min stock 1'],
        default: 1
    },
    image:{
        type:String,
        required:[true,'you must enter your image']
    },
    ownerId:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        validate : {
            validator : function(v) {
                    if (v === 'travel' || v === 'watch') {
                        return true
                    } else {
                        return false
                    }
            }
        },
        required:[true,'you must enter your status']
    },
    location:{
        type: String,
        required:[true,'you must enter your location']
    }
});

const Model = mongoose.model('Item', ItemSchema)
module.exports = Model