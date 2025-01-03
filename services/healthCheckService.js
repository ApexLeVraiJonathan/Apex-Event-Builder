import { checkDatabaseConnection } from '../config/cosmos.js';
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
      const isConnected = await checkDatabaseConnection();

      return {
        status: isConnected ? 'healthy' : 'degraded',
        database: isConnected ? 'connected' : 'disconnected',
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
