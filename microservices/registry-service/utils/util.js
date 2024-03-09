import logger from '../shared/logger'
import { CustomError, BaseError } from '../shared/error'
import HttpStatusCode from '../shared/httpStatusCodes'

export function responseSender (err, response, result) {
  if (result) {
    logger.info(result)
  } else {
    logger.error(err)
  }

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

export function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
