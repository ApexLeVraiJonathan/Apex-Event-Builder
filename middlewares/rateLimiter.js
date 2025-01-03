import rateLimit from 'express-rate-limit';

export const defaultLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 60, // limit each IP to 60 requests per minute
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

export const riotApiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100, // limit each IP to 100 requests per 2 minutes
  message: {
    success: false,
    message: 'Too many requests to Riot API, please try again later',
  },
});

export const tournamentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 tournament operations per minute
  message: {
    success: false,
    message: 'Too many tournament operations, please try again later',
  },
});

export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 webhook operations per minute
  message: {
    success: false,
    message: 'Too many webhook operations, please try again later',
  },
});
