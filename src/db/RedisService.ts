import { Redis } from 'ioredis';
import config from '../config';

class RedisService {
  static async init(): Promise<Redis> {
    // Assuming config.redis.port is a number. Adjust the type if necessary.
    const redis = new Redis(config.redis.port);
    redis.on('connect', () => {
      console.log('connected to Redis');
    });

    redis.on('error', (e: Error) => {
      console.error(e);
      process.exit(1);
    });

    config.redis.client = redis;
    return redis;
  }

  static async disconnect(): Promise<void> {
    if (config.redis.client) {
      try {
        await config.redis.client.quit();
        console.log('Disconnected from Redis');
      } catch (error) {
        console.error(`Error disconnecting from Redis: ${error}`);
      }
    }
  }
}

export default RedisService;