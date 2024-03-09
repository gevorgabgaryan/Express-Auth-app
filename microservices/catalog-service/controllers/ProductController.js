import ProductService from '../serveces/ProductService'

class ProductController {
  static async all (req, res) {
    const { page, itemsPerPage, keyword } = req.query
    try {
      res.promisify(await ProductService.getProducts(
        page,
        itemsPerPage,
        keyword
      ))
    } catch (e) {
      res.promisify(Promise.reject(e))
    }
  }

  static async one (req, res) {
    const { id } = req.params
    try {
      res.promisify(await ProductService.getProduct(id))
    } catch (e) {
      res.promisify(Promise.reject(e))
    }
  }

  static async add (req, res) {
    const { sku, name, price, count, isVisible, discountPercentage } = req.body
    try {
      res.promisify(await ProductService.addProduct(
        sku,
        name,
        price,
        count,
        isVisible,
        discountPercentage
      ))
    } catch (e) {
      res.promisify(Promise.reject(e))
    }
  }

  static async edit (req, res) {
    const { sku, name, price, count, visible, discountPercentage } = req.body
    const { id } = req.params
    try {
      res.promisify(await ProductService.editProduct(
        id,
        sku,
        name,
        price,
        count,
        visible,
        discountPercentage
      ))
    } catch (e) {
      res.promisify(Promise.reject(e))
    }
  }

  static async delete (req, res) {
    const { id } = req.params
    try {
      res.promisify(await ProductService.deleteProduct(id))
    } catch (e) {
      res.promisify(Promise.reject(e))
    }
  }

  static async totalDiscount (req, res) {
    try {
      res.promisify(await ProductService.totalDiscount())
    } catch (e) {
      res.promisify(Promise.reject(e))
    }
  }
}

export default ProductController
