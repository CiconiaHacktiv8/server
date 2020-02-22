const Item = require('express').Router()
const ItemCon = require('../controllers/ItemCon')
const {authenticate,authorizeItem} = require('../midllewares/auth')


//find all
Item.get('/',ItemCon.findAll)

//find one
Item.get('/:id',ItemCon.findOne)

Item.use(authenticate)
//create
Item.post('/' ,ItemCon.create)

//delete one
Item.delete('/:id' ,ItemCon.remove)

//update
Item.put('/:id',authorizeItem ,ItemCon.update)

//update stock
Item.patch('/:id', ItemCon.priceStatusUpdate)



module.exports = Item