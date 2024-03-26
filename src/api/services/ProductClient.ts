import Container, { Service } from 'typedi';
import { RegisterBody } from '../controllers/requests/auth/RegisterBody';
import { User } from './models/User';
import * as argon from 'argon2';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/UserRepository';
import { MailService } from './MailService';
import { UserStatus } from '../enums/UserStatuses';
import { LoginBody } from '../controllers/requests/auth/LoginBody';
import { BadRequestError } from 'routing-controllers';
import { Auth } from './models/Auth';
import config from '../../config';
import { AuthProviderRepository } from '../repositories/AuthProviderRepository';
import { AuthProvider } from './models/AuthProvider';
import { UserService } from './UserService';
import { WebSocketService } from '../../websocket';
import { BaseService } from './BaseService';
import { UserExistsError } from '../errors/UserExistsError';
import { ProductQuery } from '../controllers/requests/product/ProductQuery';
import logger from '../../lib/logger';
import ServiceClient from './ServiceClient';
import Redis from 'ioredis';
import MessageBroker from '../../lib/message-broker';



@Service()
export class ProductClient extends BaseService {
  constructor(
    private serviceClient: ServiceClient
  ) {
    super();
  }

  public async all(query: ProductQuery): Promise<any> {
    const queryMessage: Buffer = Buffer.from(JSON.stringify(query));
    const correlationId: string = uuidv4();

    const requestQueue: string = 'product_requests';
    const channel = MessageBroker.getChannel();
    if (channel === null) {
      throw new Error('Channel not found');
    }

    await channel.assertQueue(requestQueue, { durable: false });
    const { queue: replyQueue } = await channel.assertQueue('', { exclusive: true });


    channel.sendToQueue(requestQueue, queryMessage, {
      correlationId,
      replyTo: replyQueue,
    });

    return new Promise((resolve, reject) => {
      const timeoutHandle: NodeJS.Timeout = setTimeout(() => {
        channel.deleteQueue(replyQueue);
        reject(new Error('Operation timed out'));
      }, 20000);

      channel.consume(replyQueue, (msg: any) => {
        if (msg !== null && msg.properties.correlationId === correlationId) {
          clearTimeout(timeoutHandle);
          channel.deleteQueue(replyQueue);
          resolve(JSON.parse(msg.content.toString()));
        }
      }, { noAck: true });
    }).catch((error) => {
      console.error('Error or timeout', error);
      throw new BadRequestError();
    });
  }


  // public async all(query: ProductQuery) {
  //   try{

  //     const redisClient: Redis | null = config.redis.client;

  //     const {page, itemsPerPage, keyword} =  query;

  //     const cacheKey = `getProducts:${page}:${itemsPerPage}:${keyword}`;

  //     if (redisClient) {
  //       const cacheResult = await redisClient.get(cacheKey);
  //       if (cacheResult) {
  //         return JSON.parse(cacheResult);
  //       }
  //     }

  //     const result = await this.serviceClient.callService('catalog-service', {
  //       method: 'get',
  //       url: '/product',
  //       params: {
  //         page, itemsPerPage, keyword
  //       }
  //     })

  //     if (redisClient) {
  //       await redisClient.setex(cacheKey, 3600, JSON.stringify(result));
  //     }

  //     return result;

  //   } catch (error: any) {
  //     logger.error(error);
  //     throw error;
  //   }
  // }

  public async add(authorizationHeader: string, productData: any) {
    try {
      const result = await this.serviceClient.callService('catalog-service', {
        method: 'post',
        url: '/product/add',
        data: productData,
        headers: { Authorization: authorizationHeader }
      });

      this.invalidateProductCache();

      return result;
    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

  public async getProduct(id: string) {
    try{
        const result = await this.serviceClient.callService('catalog-service', {
        method: 'get',
        url: `/product/get/${id}`,
      })



      return result;

    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

  private async invalidateProductCache() {
    const redisClient: Redis | null = config.redis.client;
    if (!redisClient) {
      return;
    }

    // await redisClient.flushall();

    const cacheKeyPattern = 'getProducts:*';

    let cursor = '0';
    do {
      const scanResult = await redisClient.scan(cursor, 'MATCH', cacheKeyPattern, 'COUNT', '100');
      cursor = scanResult[0];
      const keys = scanResult[1];

      if (keys.length) {
        await redisClient.del(keys);
      }
    } while (cursor !== '0');
  }


}
