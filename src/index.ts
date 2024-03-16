import 'reflect-metadata';
import Tracing from './lib/tracing';
import config from './config';
Tracing(`${config.serviceName}:${config.serviceVersion}`);
import Container from 'typedi';
import { API } from './api';
import { TypeORM } from './db';
import SocketIO from './SocketIO';
import { WebSocketService } from './websocket';
import MessageBroker from './lib/message-broker';

(async () => {
  try {
    await TypeORM.init();
    await MessageBroker.init();
    const httpServer = await API.init();
    const webSocketService = Container.get(WebSocketService);
    await webSocketService.init();
    await SocketIO.init(httpServer);
  } catch (e) {
    console.log(e);
  }
})();