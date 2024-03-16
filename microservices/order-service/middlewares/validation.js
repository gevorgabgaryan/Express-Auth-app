import {
  registerBodySchema,
  loginBodySchema,
  verifyParamsSchema,
  resetPasswordBodySchema,
  verifyResetPasswordBodySchema,
  verifyResetPasswordParamsSchema
} from '../validators/authValidatorSchemas.js'
import {
  getProductsQuerySchema,
  addProductBodySchema,
  editProductBodySchema
} from '../validators/productValidatorSchemas.js'
import { objectIdParamsSchema } from '../validators/generalValidator.js'
import { validationHandler } from '../utils/util'

// auth validators

export const validateRegisterData = (req, res, next) => {
  validationHandler(req, res, next, registerBodySchema)
}

export const validateLoginData = (req, res, next) => {
  validationHandler(req, res, next, loginBodySchema)
}

export const validateVerifyData = (req, res, next) => {
  validationHandler(req, res, next, null, null, verifyParamsSchema)
}

export const validateResetPasswordData = (req, res, next) => {
  validationHandler(req, res, next, resetPasswordBodySchema)
}

export const validateVerifyResetPassword = (req, res, next) => {
  validationHandler(
    req,
    res,
    next,
    verifyResetPasswordBodySchema,
    null,
    verifyResetPasswordParamsSchema
  )
}

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

// general
export const validateParamsObjectId = (req, res, next) => {
  validationHandler(req, res, next, null, null, objectIdParamsSchema)
}
