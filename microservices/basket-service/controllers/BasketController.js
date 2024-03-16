import BasketService from '../services/BasketService'
import config from '../config'


class BasketController {
  static async add (req, res) {
    try {
      const { id } = req.params
      console.log(100, req.userId)
      const basket = new BasketService(config.redis.client, req.userId)
      await basket.add(id)
      const itemCount = await basket.getItemCount(id)
      res.promisify({
        status: true,
        result: itemCount
      })
    } catch (e) {
      console.log(e);
      res.promisify(Promise.reject(e))
    }
  }

  static async getUserProducts(req, res) {
    try {
      const { id } = req.params
      console.log(id)
      const basket = new BasketService(config.redis.client, id);
      const basketProducts = await basket.getAll();
      res.promisify(basketProducts)
    } catch (e) {
      console.log(e);
      res.promisify(Promise.reject(e))
    }
  }

  static async empty(req, res) {
    try {
      const { id } = req.params
      console.log(id)
      const basket = new BasketService(config.redis.client, id);
      basket.empty();
      res.promisify({message: 'done'})
    } catch (e) {
      console.log(e);
      res.promisify(Promise.reject(e))
    }
  }
}

export default BasketController