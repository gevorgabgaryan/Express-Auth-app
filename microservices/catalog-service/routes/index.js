import { Router } from 'express'
import {
  validateGetProducts,
  validateAddProduct,
  validateParamsObjectId,
  validateEditProduct
} from '../middlewares/validation'
import ProductController from '../controllers/ProductController'
import { checkAuthorization } from '../middlewares/checkAuthorization'

const productRoutes = Router()

productRoutes.get('/', validateGetProducts, ProductController.all)
productRoutes.get('/get/:id', validateParamsObjectId, ProductController.one)

productRoutes.post(
  '/add',
  validateAddProduct,
  checkAuthorization(),
  ProductController.add
)

productRoutes.put(
  '/edit/:id',
  validateEditProduct,

  ProductController.edit
)
productRoutes.delete(
  '/delete/:id',
  validateParamsObjectId,
  checkAuthorization(),
  ProductController.delete
)
productRoutes.get(
  '/total-discount',
  ProductController.totalDiscount
)

export default productRoutes
