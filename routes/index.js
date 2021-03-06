const express = require('express')
const route = express.Router()
const travelRoute = require('./travel-route')
const item = require('./item')
const payment = require('./payment')
const cartRoute = require('./cart-route')
const { authenticate } = require('../midllewares/auth')

const UserController = require('../controllers/UserCon')

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.use('/travels', travelRoute)
route.use('/carts', cartRoute)
route.use('/items', item)
route.get('/users', authenticate, UserController.getUserDetail)
route.use('/payment', payment)

module.exports = route
