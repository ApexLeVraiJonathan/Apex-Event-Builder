import NodeCache from 'node-cache';
import { CACHE_TTL } from '../config/env.js';
import logger from './logger.js';

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: CACHE_TTL,
      checkperiod: CACHE_TTL * 0.2,
    });

    this.cache.on('expired', (key) => {
      logger.debug(`Cache key expired: ${key}`);
    });
  }

  get(key) {
    const value = this.cache.get(key);
    logger.debug({
      message: value ? 'Cache hit' : 'Cache miss',
      key,
    });
    return value;
  }

  set(key, value, ttl = null) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }
}

export const cacheService = new CacheService();
