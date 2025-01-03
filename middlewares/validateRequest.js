import { AppError } from '../utils/errors.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, { abortEarly: false });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        throw new AppError(errors.join(', '), 400);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError('Validation error', 400));
      }
    }
  };
};
