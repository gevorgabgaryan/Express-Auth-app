import amqplib from 'amqplib';
import Config from '../../config'
import logger from '../../shared/logger';

class MessageBroker {

  static async init () {
    const connection = await amqplib.connect(Config.messageBroker.url);
    const channel = await connection.createChannel();
    Config.messageBroker.channel = channel
    return channel
  }

  static async SubscribeOrderMessages(service) {
    const channel = Config.messageBroker.channel;
    if (!channel) {
      throw new Error('Channel not found')
    }
    const queue = "orders"
    await channel.assertQueue(queue, { durable: true })
    channel.consume(
      queue,
      async (message) => {
        try {
          const order = JSON.parse(message.content.toString());
          console.log('orser', order)
          if (!order) {
            channel.nack(message, false)
          }
          await service.add(order.userId, order.products);
          channel.ack(message);
        } catch (error) {
          logger.error('Failed to process message', error);
          channel.nack(message, false, true);
        }
      },
      { noAck: false },
    );
  }

}

export default MessageBroker