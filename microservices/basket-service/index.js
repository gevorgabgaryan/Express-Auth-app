import Tracing from './lib/tracing';
import Config from './config';

(async () => {
    await Tracing(`${Config.serviceName}:${Config.serviceVersion}`);
    const RedisService = (await import('./databases/RedisService')).default;
    const logger = (await import('./shared/logger')).default;
    const API = (await import('./API/API')).default;

    try {
        await RedisService.init();
        const apiServer = await API.init();
    } catch (e) {
        console.error(e);
        logger.error(e);
    }
})();

