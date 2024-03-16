import Tracing from './lib/tracing';
import Config from './config';

(async () => {
    await Tracing(`${Config.serviceName}:${Config.serviceVersion}`);
    const SequelizeService = (await import('./databases/SequelizeService')).default;
    const MessageBroker = (await import('./lib/message-broker')).default;
    const logger = (await import('./shared/logger')).default;
    const API = (await import('./API/API')).default;

    try {
        await SequelizeService.init();
        await MessageBroker.init();
        const apiServer = await API.init();
    } catch (e) {
        console.error(e);
        logger.error(e);
    }
})();



