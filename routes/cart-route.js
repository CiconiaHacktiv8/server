const router = require('express').Router()
const CartController = require('../controllers/cart-controller')
const { authenticate } = require('../midllewares/auth')

router.get('/', CartController.getAllCarts)
router.get('/:cartId', CartController.getCart)
router.post('/', authenticate, CartController.addNewCart)
router.patch('/:cartId', CartController.editCart)
router.delete('/:cartId', CartController.deleteCart)

module.exports = router
