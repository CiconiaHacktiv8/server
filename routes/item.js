const Item = require('express').Router()
const ItemCon = require('../controllers/ItemCon')
const {authenticate,authorizeItem} = require('../midllewares/auth')
const gcsUpload = require('../midllewares/googleUpload')
const convertToBuffer = require('../midllewares/convertToBuffer')

//find all
Item.get('/',ItemCon.findAll)

//find one
Item.get('/:id',ItemCon.findOne)

Item.use(authenticate)
//create
Item.post('/' ,convertToBuffer ,gcsUpload.single('image') ,ItemCon.create)

//delete one
Item.delete('/:id' ,ItemCon.remove)

//update
Item.put('/:id',authorizeItem ,ItemCon.update)

//update stock
Item.patch('/:id', ItemCon.priceStatusUpdate)



module.exports = Item