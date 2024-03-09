import { config } from 'dotenv'
import pkg from "../package.json";
config()

const Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: 8008,
  mongoDB: {
    url: process.env.MONGO_DB_URL
  },
  serviceName: pkg.name,
  serviceVersion: pkg.version
}

export default Config
