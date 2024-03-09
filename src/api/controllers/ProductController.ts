import { Authorized, Body, CurrentUser, Get, JsonController, OnUndefined, Post, QueryParams, UseBefore } from 'routing-controllers';
import { RegisterBody } from './requests/auth/RegisterBody';
import { Service } from 'typedi';
import { ProductQuery } from './requests/product/ProductQuery';
import { ProductClient } from '../services/ProductClient';


@JsonController('/products')
@Service()
export class ProductController {
  constructor(private productClient: ProductClient) {}


  @Get('/all')
  async all(@QueryParams() query: ProductQuery) {
    const products = await this.productClient.all(query);
    return products;
  }

}
