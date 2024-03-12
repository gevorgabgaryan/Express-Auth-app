import Tracing from './lib/tracing';
import Config from './config';

(async () => {
    await Tracing(`${Config.serviceName}:${Config.serviceVersion}`);
    const MongooseService = (await import('./databases/MongooseService')).default;
    const logger = (await import('./shared/logger')).default;
    const API = (await import('./API/API')).default;

    try {
        await MongooseService.init();
        const apiServer = await API.init();
    } catch (e) {
        console.error(e);
        logger.error(e);
    }
})();

