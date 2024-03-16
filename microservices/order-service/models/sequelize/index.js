import OrderModel from './OrderModel'
import OrderItemModel from './OrderItemModel'

const Models = (sequelize) => {
  const Order = OrderModel(sequelize)
  const OrderItem = OrderItemModel(sequelize)

  Order.hasMany(OrderItem)
  OrderItem.belongsTo(Order, {
    onDelete: 'CASCADE',
    foreignKey: {
      allowNull: false
    }
  })

  sequelize.sync()
}

export default Models
