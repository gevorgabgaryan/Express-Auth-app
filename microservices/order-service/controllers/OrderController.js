import OrderService from '../serveces/OrderServce'
import Config from '../config'
import logger from '../shared/logger'

class OrderController {
  static async add (req, res) {
    try {
      const orderService = new OrderService(Config.mysql.client)
      const result = orderService.add(req.userId)
      res.json({
        status: true,
        result
      })
    } catch (e) {
      logger.error(e)
      res.json({
        status: false,
        error: true,
        message: 'System error'
      })
    }
  }
}

export default OrderController
