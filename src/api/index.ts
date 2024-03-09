import 'reflect-metadata';
import { Mapper } from '@nartc/automapper';
import { createExpressServer, useContainer } from 'routing-controllers';
import config from '../config';
import { AuthController } from './controllers/AuthController';
import { Container } from 'typedi';
import { ControllerMapperProfile } from './controllers/mapper/ControllerMapperProfile';
import { RepositoryMapperProfile } from './repositories/mapper/RepositoryMapperProfile';
import authorizationChecker from './auth/authorizationChecker';
import currentUserChecker from './auth/currentUserChecker';
import { UserController } from './controllers/UserController';
import SetupPassport from '../lib/passport';
import { GithubController } from './controllers/GithubController';
import https from 'https';
import express from 'express';
import logger from '../lib/logger';
import { RequestLogMiddleware } from './middlewares/RequestLogMiddleware';
import { SecurityMiddleware } from './middlewares/SecurityMiddleware';
import { RateLimitingMiddleware } from './middlewares/RateLimitingMiddleware';
import fs from 'fs';
import path from 'path';
import { ErrorHandlerMiddleware } from './middlewares/ErrorHandlerMiddleware';
import { NotFoundMiddleware } from './middlewares/NotFoundMiddleware';
import { ProductController } from './controllers/ProductController';

export class API {
  static server: https.Server;

  static async init() {
    const passport = SetupPassport();

    useContainer(Container);
    const app = createExpressServer({
      cors: true,
      controllers: [AuthController, UserController, GithubController, ProductController],
      middlewares: [RequestLogMiddleware, SecurityMiddleware, RateLimitingMiddleware, ErrorHandlerMiddleware, NotFoundMiddleware],
      routePrefix: '/api',
      validation: {
        whitelist: true,
        forbidNonWhitelisted: true,
      },
      defaultErrorHandler: false,
      authorizationChecker: authorizationChecker,
      currentUserChecker: currentUserChecker,
    });

    app.use(passport.initialize());

    app.use(express.static('public'));

    API.initAutoMapper();

    const options = {
      key: fs.readFileSync(path.join(__dirname, '..', '..', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '..', '..', 'cert.pem')),
      passphrase: 'Gevorg',
    };

    API.server = https.createServer(options, app);

    API.server.listen(config.port, () => {
      logger.info(`Server started at https://localhost:${config.port}`);
    });

    return API.server;
  }

  static async close() {
    if (API.server) {
      API.server.close(() => {
        logger.info('Server closed.');
      });
    }
  }

  static initAutoMapper() {
    Mapper.withGlobalSettings({
      skipUnmappedAssertion: true,
      useUndefined: true,
    });
    Mapper.addProfile(RepositoryMapperProfile);
    Mapper.addProfile(ControllerMapperProfile);
  }
}
