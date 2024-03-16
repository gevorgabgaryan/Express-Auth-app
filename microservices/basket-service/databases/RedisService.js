import { Redis } from 'ioredis'
import config from '../config'

class RedisService {
  static async init () {
    const redis = new Redis(config.redis.port)
    redis.on('connect', () => {
      console.log('connected to Redis')
    })
    redis.createBuiltinCommand('error', (e) => {
      console.log(e)
      process.exit(1);
    })
    config.redis.client = redis
    return redis
  }

  static async disconnect () {
    if (config.redis.client) {
      try {
        await config.redis.client.quit()
        console.log('Disconnected from Redis')
      } catch (error) {
        console.log(`Error disconnecting from Redis: ${error}`)
      }
    }
  }
}

export default RedisService