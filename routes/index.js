const express = require('express')
const route = express.Router()
const travelRoute = require('./travel-route')

const UserController = require('../controllers/UserCon')

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.use('/travels', travelRoute)

module.exports = route
