import { client as cosmosClient } from '../config/cosmos.js';
import logger from '../utils/logger.js';

class HealthCheckService {
  async getBasicStatus() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }

  async getDetailedStatus() {
    const start = Date.now();

    try {
      await cosmosClient.getDatabaseAccount();

      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start,
      };
    } catch (error) {
      logger.error('Health check failed:', error);
      return {
        status: 'degraded',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - start,
      };
    }
  }
}

export const healthCheckService = new HealthCheckService();
