import { matchedData } from 'express-validator';

export const sanitizeRequest = (req, res, next) => {
  req.sanitizedBody = matchedData(req, {
    locations: ['body'],
    includeOptionals: true,
  });

  next();
};
