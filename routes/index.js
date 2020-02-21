const express = require('express')
const route = express.Router()

const UserController = require('../controllers/UserCon')

route.use('/login', UserController.login)
route.use('/register', UserController.register)

module.exports = route
