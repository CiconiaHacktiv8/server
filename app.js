if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const route = require('./routes')
const errorHandler = require('./midllewares/errorHandler')
const cors = require('cors')

const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', function(socket) {
  app.use(function(req, res, next) {
    req.socket = socket
    req.io = io
    next()
  })
  app.use(cors())
  app.use(express.urlencoded({ extended: false, limit: 10e7 }))
  app.use(express.json({ limit: 10e7 }))
  app.use('/', route)
  app.use(errorHandler)
})

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db connected !!')
  })
  .catch(err => {
    console.log(err)
  })

module.exports = http
