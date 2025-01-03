import winston from 'winston';
import { IS_PRODUCTION } from '../config/env.js';

const logger = winston.createLogger({
  level: IS_PRODUCTION ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, ...rest }) => {
      let logMessage = `${timestamp} ${level}: `;

      // Handle objects and arrays properly
      if (typeof message === 'object') {
        logMessage += JSON.stringify(message);
      } else {
        logMessage += message;
      }

      // Add any additional metadata
      if (Object.keys(rest).length > 0) {
        logMessage += ` ${JSON.stringify(rest)}`;
      }

      return logMessage;
    }),
  ),
  defaultMeta: { service: 'tournament-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport for non-production environments
if (!IS_PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...rest }) => {
          let logMessage = `${timestamp} ${level}: `;

          // Handle objects and arrays properly
          if (typeof message === 'object') {
            logMessage += JSON.stringify(message);
          } else {
            logMessage += message;
          }

          // Add any additional metadata
          if (Object.keys(rest).length > 0) {
            logMessage += ` ${JSON.stringify(rest)}`;
          }

          return logMessage;
        }),
      ),
    }),
  );
}

export default logger;
