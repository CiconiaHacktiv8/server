const router = require('express').Router()
const TravelController = require('../controllers/travel-controller')
const { authenticate, authorizeTravel } = require('../midllewares/auth')

router.get('/', TravelController.getAllTravels)
router.get('/:travelId', TravelController.getTravel)
router.use(authenticate)
router.post('/', TravelController.addNewTravel)
router.use('/:travelId', authorizeTravel)
router.patch('/:travelId', TravelController.editTravel)
router.delete('/:travelId', TravelController.deleteTravel)

module.exports = router
