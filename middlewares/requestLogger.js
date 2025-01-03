import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  // Skip logging for Swagger UI and assets
  if (
    req.url.startsWith('/api-docs') ||
    req.url.includes('swagger-ui') ||
    req.url.includes('favicon')
  ) {
    return next();
  }

  const startTime = Date.now();
  const { correlationId } = req;

  // Log request
  logger.info({
    correlationId,
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info({
      correlationId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
