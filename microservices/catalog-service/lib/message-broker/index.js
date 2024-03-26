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


}

export default MessageBroker