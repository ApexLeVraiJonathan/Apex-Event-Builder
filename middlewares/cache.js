import NodeCache from 'node-cache';
import logger from '../utils/logger.js';

// Initialize cache with 5 minutes standard TTL
const cache = new NodeCache({ stdTTL: 300 });

export const cacheMiddleware = (keyPrefix) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedResponse = cache.get(key);

      if (cachedResponse) {
        logger.debug(`Cache hit for key: ${key}`);
        return res.json(cachedResponse);
      }

      // Store the original json method
      const originalJson = res.json;

      // Override json method to cache the response
      res.json = function (data) {
        // Store in cache
        cache.set(key, data);
        logger.debug(`Cached response for key: ${key}`);

        // Call the original json method
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      logger.error('Cache error:', error);
      next();
    }
  };
};

export const clearCache = (keyPrefix) => {
  const keys = cache.keys();
  const prefixKeys = keys.filter((key) => key.startsWith(`${keyPrefix}:`));
  cache.del(prefixKeys);
  logger.debug(`Cleared cache for prefix: ${keyPrefix}`);
};

export const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
  };
};
