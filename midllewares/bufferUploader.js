const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
})

const bucketName = process.env.CLOUD_BUCKET
const bucket = storage.bucket(bucketName)

module.exports = (req, res, next) => {
  if (!req.body.base64) {
    req.body.image = null
    next()
  }

  const buff = Buffer.from(req.body.base64, 'base64') // make it to buffer
  const file = bucket.file(req.body.imageName)

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
        req.body.image = `https://storage.googleapis.com/${bucketName}/${req.body.imageName}`
        next()
      }
    },
  )
}
