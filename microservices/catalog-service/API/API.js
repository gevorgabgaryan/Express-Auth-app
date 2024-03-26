import express from 'express';
import axios from 'axios';
import { createServer } from 'http'
import Config from '../config'
import apiRoutes from '../routes'
import cors from 'cors'
import requestLogger from '../shared/requestLogger'
import logger from '../shared/logger'
import helmet from 'helmet'
import { responseSender } from '../utils/util'
import { CustomError } from '../shared/error'
import { promisifyAPI } from '../middlewares/promisify'
import ProductService from '../serveces/ProductService';

class API {
  static async init () {
    const app = express()
    app.use(promisifyAPI())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(helmet())
    app.use(cors())
    app.use(requestLogger)
    app.use('/product', apiRoutes)

    app.use((req, res) => {
      const message = {
        message: 'API not found',
        method: req.method,
        url: req.originalUrl,
        IP: req.headers['x-forwarded-for']
      }
      logger.warn(message)
      responseSender(
        new CustomError('API not found', 'API_NOT_FOUND', 400, message),
        res
      )
    })

    app.use(function (req, res, next) {
      const info = {
        url: req.originalUrl,
        IP: req.headers['x-forwarded-for']
      }
      res.promisify(
        Promise.reject(
          new CustomError('API not found', 'API_NOT_FOUND', 400, info)
        )
      )
    })
    app.use(function (err, req, res, next) {
      res.promisify(Promise.reject(err))
    })

    const server = createServer(app);


    server.on('listening', () => {
      const addr = server.address()
      const bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      logger.info(
        `${Config.serviceName}:${Config.serviceVersion} listening on ${bind}`
      )




     })

    API.startConsumer();

    server.listen(0);

    return server
  }

  static async startConsumer() {
    try {
    const requestQueue = 'product_requests';

    const channel = Config.messageBroker.channel
    await channel.assertQueue(requestQueue, { durable: false });

    console.log("Waiting for messages in %s. To exit press CTRL+C", requestQueue);
    channel.consume(requestQueue, async (msg) => {
      if (msg !== null) {
        const query = JSON.parse(msg.content.toString());
        const { page, itemsPerPage, keyword } = query;
        const products = await ProductService.getProducts(page, itemsPerPage, keyword);
        console.log('products', products.products.length);
        if (msg.properties.replyTo) {
          channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(products)), {
            correlationId: msg.properties.correlationId,
          });
        }
      }
    }, { noAck: true });
    } catch(e) {
      logger.error(e);
      throw e
    }
  }
}

export default API
