import { CosmosClient } from '@azure/cosmos';
import { COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DATABASE } from './env.js';
import logger from '../utils/logger.js';

const client = new CosmosClient({
  endpoint: COSMOS_ENDPOINT,
  key: COSMOS_KEY,
});

const database = client.database(COSMOS_DATABASE);

// Map to store container references
const containers = new Map();

// Initialize containers
const initializeDatabase = async () => {
  try {
    const containersToInit = [
      'gameCallbacks',
      'gameResults',
      'teamWebhooks',
      'tournamentCodes',
      'tournamentProviders',
      'tournaments',
    ];

    for (const containerName of containersToInit) {
      const container = database.container(containerName);
      containers.set(containerName, container);
      logger.info(`Container ${containerName} initialized`);
    }
  } catch (error) {
    logger.error('Error initializing Cosmos containers:', error);
    throw error;
  }
};

export { containers, client, initializeDatabase };
