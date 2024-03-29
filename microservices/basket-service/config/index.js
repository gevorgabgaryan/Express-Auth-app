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
  redis: {
    port: process.env.REDIS_PORT || 6379,
    client: null
  },
  JWTSecret: 'secret',

}

export default Config
