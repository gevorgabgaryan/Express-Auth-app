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
  userRoles: ['user', 'admin', 'editor'],
  userStatuses: ['new', 'active', 'inactive'],
  mail: {
    email: process.env.MAIL_EMAIL,
    password: process.env.MAIL_PASSWORD,
  },
  JWTSecret: 'secret',
}

export default Config
