import { DataTypes } from 'sequelize'

const OrderItemModel = (sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
    sku: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2),
  })
  return OrderItem
}

export default OrderItemModel
