import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res) => {
  const correlationId = req.correlationId;

  // Log error with correlation ID
  logger.error({
    correlationId,
    message: 'Error occurred',
    error: err.message,
    stack: err.stack,
  });

  // Handle specific error types
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return ApiResponse.error(res, err.message, 400);
  }

  // Handle Cosmos DB errors
  if (err.code === 404) {
    return ApiResponse.error(res, 'Resource not found', 404);
  }

  // Default error response
  return ApiResponse.error(
    res,
    'An unexpected error occurred',
    err.statusCode || 500,
  );
};
