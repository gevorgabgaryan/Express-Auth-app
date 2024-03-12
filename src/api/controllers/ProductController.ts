import { Authorized, Body, CurrentUser, Get, JsonController, OnUndefined, Post, QueryParams, Req, UseBefore } from 'routing-controllers';
import { RegisterBody } from './requests/auth/RegisterBody';
import { Service } from 'typedi';
import { ProductQuery } from './requests/product/ProductQuery';
import { ProductClient } from '../services/ProductClient';
import express from 'express';

@JsonController('/products')
@Service()
export class ProductController {
  constructor(private productClient: ProductClient) {}


  @Get('/all')
  async all(@QueryParams() query: ProductQuery) {
    const products = await this.productClient.all(query);
    return products;
  }

  @Post('/add')
  async add(@Body() productData: any, @Req() request: express.Request) {
    const authorizationHeader = request.headers.authorization || "";
    const product = await this.productClient.add(authorizationHeader, productData);
    return { status: true, result: product };
  }

}
