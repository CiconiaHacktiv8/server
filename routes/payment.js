const route = require('express').Router()
const PaymentCon = require('../controllers/PaymentCon')
const {authenticate} = require('../midllewares/auth')

route.use(authenticate)
route.get('/:id',PaymentCon.getInvoice)
route.post('/',PaymentCon.createInvoice)

module.exports = route