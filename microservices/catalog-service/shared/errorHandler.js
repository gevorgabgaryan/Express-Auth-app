import logger from './logger'
import { BaseError } from './error'

class ErrorHandler {
  async handleError (err) {
    logger.error(
      'Error message from the centralized error-handling component',
      err
    )
  }

  isTrustedError (error) {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}
export const errorHandler = new ErrorHandler()
