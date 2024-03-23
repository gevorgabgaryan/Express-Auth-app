import { Authorized, Body, CurrentUser, Get, JsonController, OnUndefined, Post, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthRateLimitingMiddleware } from './middlewares/AuthRateLimitingMiddleware';
import { AuthClient } from '../services/AuthClient';

@JsonController('/auth')
@Service()
export class AuthController {
  constructor(private authClient: AuthClient) {}

  @Post('/register')
  async register(@Body() body: any) {
    const newUser = await this.authClient.register(body);
    return newUser;
  }

  @UseBefore(AuthRateLimitingMiddleware)
  @Post('/login')
  public async login(@Body({ required: true }) body: any) {
    const auth = await this.authClient.login(body);
    return auth;
  }


}
