import { createLogger, format, transports } from 'winston'
import Config from '../config'
import { inspect } from 'util'

const logger = createLogger({
  transports: [
    new transports.File({
      level: 'warn',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/warn.log'
    }),
    new transports.File({
      level: 'error',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/error.log'
    }),
    new transports.File({
      level: 'info',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/info.log'
    }),
    new transports.File({
      level: 'debug',
      maxsize: 10000000,
      maxFiles: 5,
      filename: 'logs/debug.log'
    })
  ],
  format: format.combine(
    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    format.timestamp(),
    format.printf(({ timestamp, level, message, service }) => {
      const formattedMessage = typeof message === 'object' ? inspect(message, { depth: 2 }) : message
      return `[${timestamp}] ${service} ${level}: ${formattedMessage}`
    })
  )
})

if (Config.nodeEnv !== 'production') {
  logger.add(
    new transports.Console({
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message }) => {
          const formattedMessage = typeof message === 'object' ? inspect(message, { depth: 2 }) : message
          return `[${timestamp}]  ${level}: ${formattedMessage}`
        })
      )
    })
  )
}

export default logger
