import express from "express"
import { createServer } from "http"
import axios from "axios"
import * as amqp from "amqplib"

import Config from "../config"
import apiRoutes from "../routes/"
import cors from "cors"
import requestLogger from "../shared/requestLogger"
import logger from "../shared/logger"
import helmet from "helmet"
import { rateLimit } from "express-rate-limit"
import { responseSender } from "../utils/util"
import { CustomError } from "../shared/error"
import { promisifyAPI } from "../middlewares/promisify"
import compression from "compression"
import OrderService from "../serveces/OrderServce"
import MessageBroker from "../lib/message-broker"

class API {
  static async init() {
    const app = express()

    app.use(promisifyAPI())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(helmet())
    app.use(cors())
    app.use(compression())

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 100,
      legacyHeaders: false,
    })
    app.use(limiter)
    app.use(requestLogger)

    app.use("/order", apiRoutes)
    app.set("env", Config.nodeEnv)

    app.use((req, res) => {
      const message = {
        message: "API not found",
        method: req.method,
        url: req.originalUrl,
        IP: req.headers["x-forwarded-for"],
      }
      logger.warn(message)
      responseSender(
        new CustomError("API not found", "API_NOT_FOUND", 400, message),
        res,
      )
    })

    app.use(function (req, res, next) {
      const info = {
        url: req.originalUrl,
        IP: req.headers["x-forwarded-for"],
      }
      res.promisify(
        Promise.reject(
          new CustomError("API not found", "API_NOT_FOUND", 400, info),
        ),
      )
    })

    app.use(function (err, req, res, next) {
      res.promisify(Promise.reject(err))
    })

    app.get('/health', (req, res) => {
      res.json({ status: 'OK' });
    });

    const orderService = new OrderService(Config.mysql.client)
    await MessageBroker.SubscribeOrderMessages(orderService);

    const server = createServer(app)

    server.on("listening", () => {
      const addr = server.address()
      const register = async () =>
        axios
          .put(
            `http://127.0.0.1:8008/register/${Config.serviceName}/${Config.serviceVersion}/${addr.port}`,
          )
          .catch((e) => logger.error(e))

      const unregister = async () =>
        axios
          .delete(
            `http://127.0.0.1:8008/register/${Config.serviceName}/${Config.serviceVersion}/${addr.port}`,
          )
          .catch((e) => logger.error(e))

      register()

      const interval = setInterval(register, 10000)

      let isCleaning = false
      const cleanup = async () => {
        if (!isCleaning) {
          isCleaning = true
          clearInterval(interval)
          await unregister()
          isCleaning = true
        }
      }

      process.on("uncaughtException", async () => {
        await cleanup()
        process.exit(0)
      })

      process.on("SIGTERM", async () => {
        await cleanup()
        process.exit(0)
      })

      process.on("SIGINT", async () => {
        await cleanup()
        process.exit(0)
      })
      console.info(
        `${Config.serviceName}:${Config.serviceVersion} listening on ${addr.port}`,
      )
    })

    API.startConsumer()
    server.listen(0)

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
