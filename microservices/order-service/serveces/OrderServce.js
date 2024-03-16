import Models from "../models/sequelize"
import {CustomError} from "../shared/error";

class OrderService {
  constructor(sequelize) {
    Models(sequelize)
    this.client = sequelize
    this.models = sequelize.models
  }

  async add(userId, products) {
      await this.inTransaction(async (t) => {
       await this.create(userId, products, t)
      });
  }

  async inTransaction(work) {
    const t = await this.client.transaction()
    try {
      await work(t)
      return t.commit()
    } catch (error) {
      t.rollback()
      throw error
    }
  }

  async create(userId, items, t) {
    const order = await this.models.Order.create(
      {
        userId: userId,
        status: "Not Shipped",
      },
      {
        transaction: t,
      },
    )

    if (!order) {
      throw Error('Order saving error')
    }
    return Promise.all(
      items.map(async (item) => {
        const orderItem = await this.models.OrderItem.create({
          sku: item.sku,
          qty: item.qty,
          price: item.price,
          name: item.name,
          orderId: order.id
        });
        return order.addOrderItem(orderItem, { transaction: t })
      }),
    );
  }

  async getAll() {
    return this.models.Order.findAll({
      where: {},
      include: [this.models.OrderItem],
    })
  }

  async setStatus(orderId, status) {
    return this.models.Order.update({ status }, { where: { id: orderId } })
  }
}

export default OrderService
