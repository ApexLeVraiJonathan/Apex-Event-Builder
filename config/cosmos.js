import { CosmosClient } from '@azure/cosmos';
import { COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DATABASE } from './env.js';
import logger from '../utils/logger.js';

const client = new CosmosClient({
  endpoint: COSMOS_ENDPOINT,
  key: COSMOS_KEY,
});

const database = client.database(COSMOS_DATABASE);

// Map to store container references (private)
const containers = new Map();

// Get or initialize container
const getContainer = async (containerName) => {
  if (!containers.has(containerName)) {
    const container = database.container(containerName);
    containers.set(containerName, container);
    logger.info(`Container ${containerName} initialized`);
  }
  return containers.get(containerName);
};

const checkDatabaseConnection = async () => {
  try {
    await client.getDatabaseAccount();
    return true;
  } catch (error) {
    logger.error('Database connection check failed:', error);
    return false;
  }
};

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
      await getContainer(containerName);
    }
  } catch (error) {
    logger.error('Error initializing Cosmos containers:', error);
    throw error;
  }
};

// Only export what's needed externally
export { initializeDatabase, getContainer, checkDatabaseConnection };
