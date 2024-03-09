import logger from './shared/logger'
import API from './API/API'

let server;

(async () => {
  try {
    server = await API.init()
  } catch (e) {
    logger.error(e)
  }
})()

