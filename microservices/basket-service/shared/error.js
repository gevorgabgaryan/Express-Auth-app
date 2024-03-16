import HttpStatusCode from './httpStatusCodes'

export class CustomError {
  constructor (msg, key, code, info) {
    this.errMsg = msg
    this.errKey = key
    this.errInfo = info
    this.errCode = code
  }
}

export class BaseError extends Error {
  constructor (name, httpCode, description, isOperational) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = name
    this.httpCode = httpCode
    this.isOperational = isOperational
    Error.captureStackTrace(this)
  }
}

export class APIError extends BaseError {
  constructor (name, httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true, description = 'internal server error') {
    super(name, httpCode, isOperational, description)
  }
}

export class HTTP400Error extends BaseError {
  constructor (description = 'bad request') {
    super('NOT FOUND', HttpStatusCode.BAD_REQUEST, true, description)
  }
}
