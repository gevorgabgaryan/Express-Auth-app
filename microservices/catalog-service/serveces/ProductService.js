import ProductModel from '../models/ProductModel'
import { CustomError } from '../shared/error'
import HttpStatusCode from '../shared/httpStatusCodes'
import { escapeRegExp } from '../utils/util'

class ProductService {
  static async getProducts (page, itemPerPage, keyword) {
    const query = {
      isVisible: true
    }

    if (keyword) {
      const sanitizedKeyword = escapeRegExp(keyword)
      const regex = new RegExp(sanitizedKeyword, 'i')
      query.$or = [
        { name: { $regex: regex } },
        { sku: { $regex: regex } }
      ]
    }

    const products = await ProductModel.find(query)
      .skip((page - 1) * itemPerPage)
      .limit(itemPerPage)

    const totalProductsCount = await ProductModel.countDocuments(query)

    return {
      products,
      totalProductsCount
    }
  }

  static async getProduct (id) {
    return await ProductModel.findOne({ _id: id })
  }

  static async addProduct (
    sku,
    name,
    price,
    count,
    isVisible,
    discountPercentage
  ) {
    const skuExists = await ProductModel.exists({ sku })
    if (skuExists) {
      throw new CustomError(`The given sku ${sku} already exists`, 'ADD_PRODUCT', HttpStatusCode.BAD_REQUEST)
    }

    const product = new ProductModel({
      sku,
      name,
      price,
      count,
      discountPercentage
    })
    if (isVisible !== undefined) {
      product.isVisible = isVisible
    }

    return (await product.save()).entitize()
  }

  static async editProduct (
    id,
    sku,
    name,
    price,
    count,
    visible,
    discountPercentage
  ) {
    const updateFields = {}

    if (sku) {
      updateFields.sku = sku
    }
    if (name) {
      updateFields.name = name
    }
    if (price) {
      updateFields.price = price
    }
    if (count) {
      updateFields.count = count
    }
    if (visible !== undefined) {
      updateFields.visible = visible
    }
    if (discountPercentage !== undefined) {
      updateFields.discountPercentage = discountPercentage
    }

    const { modifiedCount } = await ProductModel.updateOne(
      { _id: id },
      { $set: updateFields }
    )
    if (modifiedCount > 0) {
      return {
        message: 'Product updated successfully'
      }
    } else {
      throw new CustomError('no changes detected or product not found', 'EDIT_PRODUCT', HttpStatusCode.BAD_REQUEST)
    }
  }

  static async deleteProduct (id) {
    const { deletedCount } = await ProductModel.deleteOne({ _id: id })
    if (deletedCount > 0) {
      return {
        message: 'Product deleted successfully'
      }
    } else {
      throw new CustomError('product not found', 'DELETE_PRODUCT', HttpStatusCode.BAD_REQUEST)
    }
  }

  static async totalDiscount () {
    return await ProductModel.calculateTotalDiscountSum()
  }

  static async deleteAll () {
    await ProductModel.deleteMany()
  }
}

export default ProductService
