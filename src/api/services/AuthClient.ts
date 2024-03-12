import { Service } from 'typedi';
import { BaseService } from './BaseService';
import logger from '../../lib/logger';
import ServiceClient from './ServiceClient';



@Service()
export class AuthClient extends BaseService {
  constructor(
    private serviceClient: ServiceClient
  ) {
    super();
  }

  public async register(registerData: any) {
    try{
      const result = await this.serviceClient.callService('auth-service', {
        method: 'post',
        url: '/auth/register',
        data: registerData
      })
      return result;

    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

  public async login(loginData: any) {
    try{
      const result = await this.serviceClient.callService('auth-service', {
        method: 'post',
        url: '/auth/login',
        data: loginData
      })
      return result;

    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

}
