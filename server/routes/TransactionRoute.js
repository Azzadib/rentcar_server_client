import { Router } from 'express'
import IndexController from '../controllers/IndexController'

const router = Router()

//* Handle item in cart
router.get('/bycart/:id', IndexController.CarCartController.existsCartID, IndexController.LineItemController.findLitebByCart)
router.get('/bycar/:id', IndexController.CarController.findOneCarID, IndexController.LineItemController.findLitebByCar)
router.get('/bynum/:number', IndexController.CarController.findOneCarNum, IndexController.LineItemController.findLitebByCarNum)
router.get('/byorder/:name', IndexController.LineItemController.findLitebByOrder)

router.post('/tocart/:id/:number',
    IndexController.UserController.existsUser, IndexController.CarCartController.existsCartUser, IndexController.CarCartController.createCart,
    IndexController.CarController.findOneCarNum, IndexController.LineItemController.existsLiteCC, IndexController.LineItemController.editLiteCC,
    IndexController.LineItemController.createLite)

router.put('/itemedit/:id',
    IndexController.LineItemController.existsLiteID, IndexController.CarController.findOneCarID, IndexController.LineItemController.editLiteID)

router.delete('/itemdelete/:id', IndexController.LineItemController.existsLiteID, IndexController.LineItemController.deleteLiteID)

//* Handle cart
router.get('/cartbyuser/:id', IndexController.UserController.existsUser, IndexController.CarCartController.findCartByUser)
router.get('/opencart/:id', IndexController.UserController.existsUser, IndexController.CarCartController.findOpenCartByUser)

router.get('/sum/:id', IndexController.CarCartController.existsCartID, IndexController.CarCartController.cartSummary)

//* Proceed to checkout
router.post('/checkout/:id', IndexController.CarCartController.existsCartID, IndexController.LineItemController.findLitebByCart,
    IndexController.CarController.carAvailable, IndexController.LineItemController.processLite)

//* Place order
router.post('/order/:id', IndexController.CarCartController.existsCartID, IndexController.CarCartController.cartSummary,
    IndexController.LineItemController.findLitebByCart, IndexController.CarController.carAvailable, IndexController.OrderController.createOrder, 
    IndexController.LineItemController.processLite, IndexController.CarCartController.closeCart, IndexController.CarController.rentCar)

//* Get orders
router.get('/myorders/:id', IndexController.OrderController.getOrderByUser)
router.get('/order/:name', IndexController.OrderController.getOrderByName)
router.get('/ordercount', IndexController.OrderController.countOrder)
router.get('/allorder', IndexController.OrderController.getAllOrder)

//* Update order
router.put('/order/:status/:name',
    IndexController.OrderController.findOrderByName, IndexController.LineItemController.litebByOrder, IndexController.OrderController.updateOrder,
    IndexController.CarController.resetCar)

//* Cancel, rent, or close order

export default router