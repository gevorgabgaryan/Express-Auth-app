import { Router } from 'express'
import RegisterController from '../controllers/RegisterController'

const productRoutes = Router()

productRoutes.put('/:servicename/:serviseversion/:serviceport', RegisterController.register)

productRoutes.delete('/:servicename/:serviseversion/:serviceport', RegisterController.unregister)

productRoutes.get('/find/:servicename/:serviseversion', RegisterController.find)

export default productRoutes
