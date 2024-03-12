import {
  registerBodySchema,
  loginBodySchema
} from '../validators/authValidatorSchemas.js'

import { validationHandler } from '../utils'

export const validateRegisterData = (req, res, next) => {
  validationHandler(req, res, next, registerBodySchema)
}

export const validateLoginData = (req, res, next) => {
  validationHandler(req, res, next, loginBodySchema)
}