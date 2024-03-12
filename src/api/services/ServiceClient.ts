import axios from 'axios';
import { Service, Inject } from 'typedi';
import config from '../../config';
import logger from '../../lib/logger';
import { BaseError } from '../errors/BaseError';


@Service()
class ServiceClient {

 static async getService(servicename: string): Promise<any> {
    try {
      const res = await axios.get(`${config.registry.url}/find/${servicename}/${config.registry.version}`);
      if (!res.data.result || !res.data.result.ip) {
        throw new BaseError(404, 'SERVICE_NOT_FOUND',`Service ${servicename} not found`, 'SERVICE_NOT_FOUND');
      }
      return res.data.result;
    } catch (e: any) {
      const message = (e.response && e.response.data && e.response.data.message) || e.message;
      logger.error(message);
      throw new  BaseError(404, 'SERVICE_NOT_FOUND', message);
    }
  }

  async callService(servicename: string, requestOptions: any): Promise<any> {
    const { ip, port } = await ServiceClient.getService(servicename);
    requestOptions.url = `http://${ip}:${port}${requestOptions.url}`;
    try {
      const response = await axios(requestOptions);
      return response.data;
    } catch (e: any) {
      console.log(e)
      const message = (e.response && e.response.data && e.response.data.message) || e.message;
      logger.error(message);
      throw new  BaseError(404, 'SERVICE_NOT_FOUND');
    }
  }
}

export default ServiceClient;