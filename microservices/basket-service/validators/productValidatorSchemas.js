import Joi from 'joi'

export const getProductsQuerySchema = Joi.object({
  page: Joi.number().required(),
  itemsPerPage: Joi.number().required().max(100),
  keyword: Joi.string().max(100)
})

export const addProductBodySchema = Joi.object({
  sku: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  count: Joi.number().positive().required(),
  discountPercentage: Joi.number().min(0).max(100),
  isVisible: Joi.boolean()
})

export const editProductBodySchema = Joi.object({
  sku: Joi.string(),
  name: Joi.string(),
  price: Joi.number().positive(),
  count: Joi.number().positive(),
  discountPercentage: Joi.number().min(0).max(100),
  visible: Joi.boolean()
})

export const objectIdParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
})
