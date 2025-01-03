import { healthCheckService } from '../services/healthCheckService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export const handleBasicHealthCheck = async (req, res, next) => {
  const { correlationId } = req;

  try {
    logger.info({
      correlationId,
      message: 'Performing basic health check',
    });

    const status = await healthCheckService.getBasicStatus();

    logger.info({
      correlationId,
      message: 'Basic health check completed',
      status: status.status,
    });

    return ApiResponse.success(res, status, 'Service is healthy');
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Basic health check failed',
      error: error.message,
    });
    next(error);
  }
};

export const handleDetailedHealthCheck = async (req, res, next) => {
  const { correlationId } = req;

  try {
    logger.info({
      correlationId,
      message: 'Performing detailed health check',
    });

    const status = await healthCheckService.getDetailedStatus();

    logger.info({
      correlationId,
      message: 'Detailed health check completed',
      status: status.status,
      responseTime: status.responseTime,
    });

    if (status.status === 'degraded') {
      return ApiResponse.error(res, 'Service partially degraded', 503, status);
    }

    return ApiResponse.success(res, status, 'All systems operational');
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Detailed health check failed',
      error: error.message,
    });
    next(error);
  }
};
