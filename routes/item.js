const Item = require('express').Router()
const ItemCon = require('../controllers/ItemCon')
const { authenticate, authorizeItem } = require('../midllewares/auth')
const gcsUpload = require('../midllewares/googleUpload')
const convertToBuffer = require('../midllewares/convertToBuffer')
const bufferUploader = require('../midllewares/bufferUploader')

//find all
Item.get('/', ItemCon.findAll)

//find one
Item.get('/:id', ItemCon.findOne)

Item.use(authenticate)
//create
Item.post('/', bufferUploader, ItemCon.create)

//delete one
Item.delete('/:id', ItemCon.remove)

//update
Item.put('/:id', authorizeItem, ItemCon.update)

//update stock
Item.patch('/:id', ItemCon.priceStatusUpdate)

module.exports = Item
