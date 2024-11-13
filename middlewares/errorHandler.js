import logger from '../utils/logger.js';

const errorHandler = (err, req, res) => {
  // Log the error details
  logger.error(
    `${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
