import { v4 as uuidv4 } from 'uuid';

export const correlationId = (req, res, next) => {
  // Get correlation ID from header or generate new one
  const correlationId = req.headers['x-correlation-id'] || uuidv4();

  // Add to request object
  req.correlationId = correlationId;

  // Add to response headers
  res.setHeader('x-correlation-id', correlationId);

  next();
};
