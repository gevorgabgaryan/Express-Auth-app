import { Service } from 'typedi';
import { BaseService } from './BaseService';
import logger from '../../lib/logger';
import ServiceClient from './ServiceClient';




@Service()
export class BasketClient extends BaseService {
  constructor(
    private serviceClient: ServiceClient,
  ) {
    super();
  }

  public async add(authorizationHeader: string, id: string) {
    try {
      const result = await this.serviceClient.callService('basket-service', {
        method: 'post',
        url: `/basket/add/${id}`,
        headers: { Authorization: authorizationHeader }
      });
      return result;
    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

  public async getUserProducts(id: string) {
    try {
      const result = await this.serviceClient.callService('basket-service', {
        method: 'get',
        url: `/basket/${id}`,
      });
      return result;
    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

  public async empty(id: string) {
    try {
      const result = await this.serviceClient.callService('basket-service', {
        method: 'delete',
        url: `/basket/${id}`,
      });
      return result;
    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

}
