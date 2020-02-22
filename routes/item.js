const Item = require('express').Router()
const ItemCon = require('../controllers/ItemCon')



//find all
Item.get('/',ItemCon.findAll)

//find one
Item.get('/:id',ItemCon.findOne)


//create
Item.post('/', ItemCon.create)

//delete one
Item.delete('/:id' ,ItemCon.remove)

//update
Item.put('/:id' ,ItemCon.update)

//update stock
Item.patch('/:id', ItemCon.priceStatusUpdate)



module.exports = Item