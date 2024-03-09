import MongooseService from './databases/MongooseService'
import logger from './shared/logger'
import API from './API/API'

(async () => {
  try {
    await MongooseService.init()
    await API.init()
  } catch (e) {
    logger.error(e)
  }
})()

