import Sequelize from "sequelize"
import Config from "../config"
import Models from "../models/sequelize"
import logger from "../shared/logger"

class SequelizeService {
  static async init() {
    try {
      const sequelize = new Sequelize(Config.mysql.options)
      sequelize.authenticate()
      logger.info("Successfully connected to MySQL")
      Config.mysql.client = sequelize
      Models(sequelize)
      return sequelize
    } catch (e) {
      logger.info("Sequelize connection error")
      logger.error(e)
      process.exit(1)
    }
  }

  static async close() {
    try {
      if (Config.mysql.client) {
        await Config.mysql.client.close()
        logger.info("Closed MySQL connection")
      }
    } catch (e) {
      logger.error("Error closing MySQL connection:", e)
    }
  }
}

export default SequelizeService
