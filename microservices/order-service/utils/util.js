import { joiOtions as options } from './constants'
import logger from '../shared/logger'
import { CustomError, BaseError } from '../shared/error'
import HttpStatusCode from '../shared/httpStatusCodes'

export const validationHandler = (
  req,
  res,
  next,
  bodySchema,
  querySchema,
  paramsSchema
) => {
  try {
    if (bodySchema) {
      const hasError = _checkSchema(res, bodySchema, req.body, options, 'body')
      if (hasError) {
        return
      }
    }
    if (querySchema) {
      const hasError = _checkSchema(
        res,
        querySchema,
        req.query,
        options,
        'query'
      )
      if (hasError) {
        return
      }
    }
    if (paramsSchema) {
      const hasError = _checkSchema(
        res,
        paramsSchema,
        req.params,
        options,
        'params'
      )
      if (hasError) {
        return
      }
    }

    next()
  } catch (e) {
    logger.error(e)
    res.json({
      status: false,
      error: true,
      message: 'System error'
    })
  }
}

const _checkIsObjExist = (obj) => {
  if (obj && Object.keys(obj).length) {
    return true
  } else {
    return false
  }
}

const _checkSchema = (res, schema, obj, options, schemaName) => {
  if (!_checkIsObjExist(obj)) {
    return res.json({
      status: false,
      error: true,
      message: `Request ${schemaName} required`
    })
  }
  const { error } = schema.validate(obj, options)
  if (error) {
    res.json({
      status: false,
      error: true,
      message: 'Validation error',
      details: error.details
    })
    return true
  }
  return false
}

export function responseSender (err, response, result) {
  let res
  let statusCode = 200
  if (err) {
    if (err instanceof CustomError) {
      res = {
        error: true,
        message: err.errMsg,
        key: err.errKey,
        code: err.errCode,
        info: err.errInfo
      }
      statusCode = err.errCode
      logger.error(err.errMsg)
    } else if (err instanceof BaseError) {
      res = {
        error: true,
        message: JSON.stringify(err),
        key: 'SYSTEM_ERROR'
      }
      statusCode = err.httpCode
      logger.error(err.toString())
      logger.error(err.name)
      logger.error(err.stack)
    } else if (typeof err === 'string') {
      res = {
        error: true,
        message: err,
        key: 'SYSTEM_ERROR'
      }
      statusCode = HttpStatusCode.INTERNAL_SERVER
      logger.error(err)
    } else {
      res = {
        error: true,
        message: 'UNEXPECTED ERROR',
        key: 'SYSTEM_ERROR'
      }
      statusCode = HttpStatusCode.INTERNAL_SERVER
      logger.error(err)
    }
  } else {
    if (!result) {
      res = { status: true }
    } else {
      res = { status: true, result }
    }
  }

  response.status(statusCode).json(res)
}
