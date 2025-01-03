import { AppError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Create a clean copy of the request body
      const bodyToValidate = { ...req.body };

      // Remove internal fields
      delete bodyToValidate.service;
      delete bodyToValidate.correlationId;
      delete bodyToValidate._internal;

      logger.debug('Request body before validation:', bodyToValidate);

      // Validate using Joi schema
      const { error, value } = schema.validate(bodyToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        logger.debug('Validation errors:', errorMessages);
        throw new AppError(errorMessages.join(', '), 400);
      }

      // Update req.body with the validated data
      req.body = value;
      logger.debug('Validated body:', value);
      next();
    } catch (error) {
      logger.error('Validation middleware error:', {
        error: error.message,
        details: error.details || 'No additional details',
      });

      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError('Validation error', 400));
      }
    }
  };
};
