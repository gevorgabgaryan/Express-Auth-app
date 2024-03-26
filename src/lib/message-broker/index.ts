import amqplib, { Channel, Connection } from 'amqplib';
import config from '../../config';
import logger from '../logger';

class MessageBroker {
  private static channel: Channel | null = null;
  private static connection: Connection | null = null;

  static async init(): Promise<void> {
    try {
        this.connection = await amqplib.connect(config.messageBroker.url);
        this.channel = await this.connection.createChannel();
        logger.info("MessageBroker initialized.");
    } catch (error) {
      logger.error("Failed to initialize MessageBroker:", error);
      throw error;
    }
  }

  static getChannel(): Channel | null {
    return this.channel;
  }

  static async sendMessage(queue: string, message: any): Promise<boolean> {
    if (!this.channel) {
      throw new Error("MessageBroker is not initialized. Call init() first.");
    }
    try {
      const messageString = JSON.stringify(message);
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(messageString));
      logger.info(`Message sent to queue "${queue}"`);
      return true;
    } catch (error) {
      logger.error("Failed to send message:", error);
      return false;
    }
  }

  static async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }
}

export default MessageBroker;
