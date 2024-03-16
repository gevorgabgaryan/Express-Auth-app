import { Service } from 'typedi';
import { BaseService } from './BaseService';
import logger from '../../lib/logger';
import { AuthClient } from './AuthClient';
import { BasketClient } from './BasketClient';
import { ProductClient } from './ProductClient';
import { NotFoundError } from '../errors/NotFoundError';
import MessageBroker from '../../lib/message-broker';


@Service()
export class OrderClient extends BaseService {
  constructor(
    private authClient: AuthClient,
    private basketClient: BasketClient,
    private productClient: ProductClient
  ) {
    super();
  }

  public async makeOrder(authorizationHeader: string) {
    try {
     const { userId } = await this.authClient.checkToken(authorizationHeader);
     const { result: basketProducts }   = await this.basketClient.getUserProducts(userId);
     if (Object.keys(basketProducts).length === 0) {
      throw new NotFoundError('products not found')
     }
     const products = await Promise.all(
        Object.keys(basketProducts).map(async (key) => {
          const { result: product} = await this.productClient.getProduct(key);
          return {
            sku: product.sku,
            qty: basketProducts[key],
            price: product.price,
            name: product.name,
          };
        }),
      );

      await MessageBroker.sendMessage('orders', {
        userId,
        products,
      });
      await this.basketClient.empty(userId);
      return {message: 'Order pending'}
    } catch (error: any) {
      logger.error(error);
      throw error;
    }
  }

}
