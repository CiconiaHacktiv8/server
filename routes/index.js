const express = require('express')
const route = express.Router()
const travelRoute = require('./travel-route')
const item = require('./item')
const cartRoute = require('./cart-route')
const { authenticate } = require('../midllewares/auth')

const UserController = require('../controllers/UserCon')

const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
})

const bucketName = process.env.CLOUD_BUCKET
const bucket = storage.bucket(bucketName)

route.post('/login', UserController.login)
route.post('/register', UserController.register)
route.use('/travels', travelRoute)
route.use('/carts', cartRoute)
route.use('/items', item)
route.get('/users', authenticate, UserController.getUserDetail)

route.post('/test-route', function(req, res) {
  const buff = Buffer.from(req.body.image.base64, 'base64')
  const file = bucket.file(req.body.image.filename)

  file.save(buff, { metadata: { contentType: 'image/jpeg' } }, function(err) {
    if (err) {
      next({
        name: 'BadRequest',
        messages: ['Error happened when upload image'],
      })
    } else {
      res.json({
        message: 'Upload image done',
        url: `https://storage.googleapis.com/${bucketName}/${req.body.image.filename}`,
      })
    }
  })
})

module.exports = route
