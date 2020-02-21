const express = require('express')
const route = express.Router()
const user = require('./user')


route.use('/users',user)



module.exports = route