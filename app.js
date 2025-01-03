import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { correlationId } from './middlewares/correlationId.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { securityMiddleware } from './middlewares/security.js';
import { sanitizeRequest } from './middlewares/sanitizer.js';
import { IS_PRODUCTION } from './config/env.js';
import { initializeDatabase } from './config/cosmos.js';
import { tournamentService } from './services/tournamentService.js';

// Import routes
import tournamentProviderRoutes from './routes/tournamentProviderRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import tournamentCodeRoutes from './routes/tournamentCodeRoutes.js';
import gameCallbackRoutes from './routes/gameCallbackRoutes.js';
import teamWebhookRoutes from './routes/teamWebhookRoutes.js';
import healthCheckRoutes from './routes/healthCheckRoutes.js';

const app = express();

// Initialize database and services
let initialized = false;
const initialize = async () => {
  if (!initialized) {
    await initializeDatabase();
    await tournamentService.init();
    initialized = true;
  }
};

// Setup middleware
app.use(cors());
app.use(express.json());
app.use(correlationId);
app.use(requestLogger);
app.use(securityMiddleware);
app.use(sanitizeRequest);

// Initialize before setting up routes
await initialize();

// Setup routes
app.use('/api/tournament-providers', tournamentProviderRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/tournament-codes', tournamentCodeRoutes);
app.use('/api/game-callbacks', gameCallbackRoutes);
app.use('/api/team-webhooks', teamWebhookRoutes);
app.use('/api/health', healthCheckRoutes);

// Swagger documentation
if (!IS_PRODUCTION) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
