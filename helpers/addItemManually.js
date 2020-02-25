const { Storage } = require('@google-cloud/storage')
const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
})

const Item = require('../models/item')

const bucketName = process.env.CLOUD_BUCKET
const bucket = storage.bucket(bucketName)

/* istanbul ignore next */
module.exports = async function(itemData, ownerId, travelId, travelLocation) {
  let image, buff, file, item, itemId

  if (!itemData.base64) image = 'https://via.placeholder.com/150'

  buff = Buffer.from(itemData.base64, 'base64')
  file = bucket.file(itemData.imageName)
  try {
    await file.save(buff, {
      metadata: {
        contentType: 'image/jpeg',
      },
    })
    
    image = `https://storage.googleapis.com/${bucketName}/${itemData.imageName}`
  } catch (err) {
    image = 'https://via.placeholder.com/150'
  }

  try {
    item = await Item.create({
      name: itemData.name,
      price: itemData.price,
      quantity: itemData.quantity,
      image,
      ownerId,
      travelId,
      status: 'travel',
      location: travelLocation,
    })
    itemId = item.id
  } catch (err) {
    itemId = null
  }

  return itemId
}
