import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// Load environment variables from .env file
dotenv.config();

const { COSMOS_DB_URI, COSMOS_DB_KEY, COSMOS_DB_DATABASE } = process.env;

const client = new CosmosClient({
  endpoint: COSMOS_DB_URI,
  key: COSMOS_DB_KEY,
});
const database = client.database(COSMOS_DB_DATABASE);

export const getContainer = (containerName) => {
  return database.container(containerName);
};

// Example usage
try {
  await client.getDatabaseAccount();
  logger.info('Successfully connected to Cosmos DB');
} catch (error) {
  logger.error('Failed to connect to Cosmos DB', error.message);
}
