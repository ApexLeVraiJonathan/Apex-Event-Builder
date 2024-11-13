import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimiter from './middlewares/rateLimiter.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './utils/logger.js';
import setupSwagger from './config/swagger.js';
import tournamentProviderRoutes from './routes/tournamentProviderRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(rateLimiter);
setupSwagger(app);

// Register routes
app.use('/api/tournaments', tournamentProviderRoutes);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
