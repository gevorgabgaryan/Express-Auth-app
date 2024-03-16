import {  Param, JsonController, Post, Req,} from 'routing-controllers';
import express from 'express';
import { Service } from 'typedi';
import { BasketClient } from '../services/BasketClient';

@JsonController('/basket')
@Service()
export class BasketController {
  constructor(private basketClient: BasketClient) {}

  @Post('/add/:id')
  async add(@Param('id') id: string, @Req() request: express.Request) {
    const authorizationHeader = request.headers.authorization || "";
    const basket = await this.basketClient.add(authorizationHeader, id);
    return { status: true, result: basket };
  }

}