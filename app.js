import express from 'express';
import { PORT } from './config/env.js';
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';
import setupSwagger from './config/swagger.js';

// Import Routes
import tournamentProviderRoutes from './routes/tournamentProviderRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';
import tournamentCodeRoutes from './routes/tournamentCodeRoutes.js';
import gameCompletionRoutes from './routes/gameCompletionRoutes.js';

const app = express();
const port = PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimiter);
setupSwagger(app);

// Register routes
app.use('/api/tournaments', tournamentProviderRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/tournaments', tournamentCodeRoutes);
app.use('/api/tournaments', gameCompletionRoutes);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
