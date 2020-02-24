const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
})

const bucketName = process.env.CLOUD_BUCKET
const bucket = storage.bucket(bucketName)

module.exports = (req, res, next) => {
  if (!req.body.image) {
    req.body.image.url = null
    next()
  }

  const buff = Buffer.from(req.body.image.base64, 'base64') // make it to buffer
  const file = bucket.file(req.body.image.filename)

  file.save(
    buff,
    {
      metadata: {
        contentType: 'image/jpeg',
      },
    },
    function(err) {
      if (err) {
        next({
          name: 'BadRequest',
          messages: ['Error happened when upload image'],
        })
      } else {
        req.body.image.url = `https://storage.googleapis.com/${bucketName}/${req.body.image.filename}`
        next()
      }
    },
  )
}
