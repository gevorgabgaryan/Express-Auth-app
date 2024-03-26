import { config } from 'dotenv'
import pkg from "../package.json";
config()

const Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoDB: {
    url: process.env.MONGO_DB_URL,
    dbName: process.env.MONGO_DB_NAME
  },
  serviceName: pkg.name,
  serviceVersion: pkg.version,
  messageBroker: {
    url: process.env.MESSAGE_BROKER_URL,
    channel: null
  }
}

export default Config
