const gcsUpload = require('gcs-upload')

const upload = function() {
  console.log('msauk sini')
  return gcsUpload({
    limits: {
      fileSize: 1e6, // in bytes
    },
    gcsConfig: {
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
      bucketName: process.env.CLOUD_BUCKET,
    },
  })
}

module.exports = upload()
