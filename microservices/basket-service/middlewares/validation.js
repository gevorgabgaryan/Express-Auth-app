import {
  getProductsQuerySchema,
  addProductBodySchema,
  editProductBodySchema,
  objectIdParamsSchema
} from '../validators/productValidatorSchemas.js'
import { validationHandler } from '../utils/util'

// product validation

export const validateGetProducts = (req, res, next) => {
  validationHandler(req, res, next, null, getProductsQuerySchema, null)
}

export const validateAddProduct = (req, res, next) => {
  validationHandler(req, res, next, addProductBodySchema, null, null)
}

export const validateEditProduct = (req, res, next) => {
  validationHandler(
    req,
    res,
    next,
    editProductBodySchema,
    null,
    objectIdParamsSchema
  )
}

export const validateParamsObjectId = (req, res, next) => {
  validationHandler(req, res, next, null, null, objectIdParamsSchema)
}
