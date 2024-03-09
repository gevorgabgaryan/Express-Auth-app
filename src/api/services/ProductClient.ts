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



@Service()
export class ProductClient extends BaseService {
  constructor(
    private serviceClient: ServiceClient
  ) {
    super();
  }

  public async all(query: ProductQuery) {
    try{
      const {page, itemsPerPage, keyword} =  query;
      const result = await this.serviceClient.callService('catalog-service', {
        method: 'get',
        url: '/product',
        params: {
          page, itemsPerPage, keyword
        }
      })
      return result;

    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

}
