import morgan from 'morgan'
import logger from './logger'

const format = ':method :url :status :res[content-length] - :response-time ms'

const options = {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}

export default morgan(format, options)
