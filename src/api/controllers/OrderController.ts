import {  Body, Get, JsonController, Post, Put, QueryParams, Req } from 'routing-controllers';
import express from 'express';
import { Service } from 'typedi';
import { OrderClient } from '../services/OrderClient';

@JsonController('/orders')
@Service()
export class OrderController {
  constructor(private orderClient: OrderClient) {}


 @Post('/add')
  async add(@Req() request: express.Request) {
    const authorizationHeader = request.headers.authorization || "";
    const order = await this.orderClient.makeOrder(authorizationHeader);
    return { status: true, result: order };
  }

}