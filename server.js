import app from './app.js';
import { PORT, IS_PRODUCTION } from './config/env.js';
import logger from './utils/logger.js';

const server = app.listen(PORT, () => {
  logger.info(
    `Server running in ${IS_PRODUCTION ? 'production' : 'development'} mode on port ${PORT}`,
  );

  if (!IS_PRODUCTION) {
    logger.info(
      `API Documentation available at http://localhost:${PORT}/api-docs`,
    );
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default server;
