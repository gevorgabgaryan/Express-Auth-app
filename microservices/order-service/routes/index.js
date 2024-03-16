import { Router } from 'express'
import { checkAuthorization } from '../middlewares/checkAuthorization'
import OrderController from '../controllers/OrderController'

const orderRoutes = Router()

orderRoutes.post('/add', checkAuthorization(), OrderController.add)

export default orderRoutes
