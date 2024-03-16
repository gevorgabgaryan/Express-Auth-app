import { Router } from 'express'
import { validateParamsObjectId } from '../middlewares/validation'
import { checkAuthorization } from '../middlewares/checkAuthorization'
import BasketController from '../controllers/BasketController'

const basketRoutes = Router()

basketRoutes.post('/add/:id', validateParamsObjectId, checkAuthorization(['user', 'admin']), BasketController.add);

basketRoutes.get('/:id', validateParamsObjectId, BasketController.getUserProducts);


basketRoutes.delete('/:id', validateParamsObjectId, BasketController.empty);

export default basketRoutes
