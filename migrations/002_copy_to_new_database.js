import { CosmosClient } from '@azure/cosmos';
import logger from '../utils/logger.js';

// New database connection details (you'll add these to your .env)
const NEW_COSMOS_ENDPOINT = process.env.NEW_COSMOS_ENDPOINT;
const NEW_COSMOS_KEY = process.env.NEW_COSMOS_KEY;
const NEW_COSMOS_DATABASE = process.env.NEW_COSMOS_DATABASE;

export const up = async (client, database) => {
  // Connect to new database
  const newClient = new CosmosClient({
    endpoint: NEW_COSMOS_ENDPOINT,
    key: NEW_COSMOS_KEY,
  });

  const newDatabase = newClient.database(NEW_COSMOS_DATABASE);

  // List of containers to migrate
  const containers = [
    'tournamentProviders',
    'tournaments',
    'tournamentCodes',
    'teamWebhooks',
    'gameCallbacks',
    'gameResults',
  ];

  for (const containerId of containers) {
    logger.info(`Migrating container: ${containerId}`);

    // Create container in new database
    const { container: newContainer } =
      await newDatabase.containers.createIfNotExists({
        id: containerId,
        partitionKey: { paths: ['/id'] },
      });

    // Get source container
    const sourceContainer = database.container(containerId);

    // Copy all documents
    const querySpec = {
      query: 'SELECT * FROM c',
    };

    const { resources: items } = await sourceContainer.items
      .query(querySpec)
      .fetchAll();

    logger.info(`Found ${items.length} items in ${containerId}`);

    // Batch create items in new container
    const batchSize = 100;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      await Promise.all(
        batch.map((item) =>
          newContainer.items.create(item).catch((error) => {
            logger.error(
              `Failed to copy item ${item.id} in ${containerId}:`,
              error,
            );
            throw error;
          }),
        ),
      );

      logger.info(
        `Copied ${Math.min(i + batchSize, items.length)}/${items.length} items in ${containerId}`,
      );
    }
  }

  logger.info('Database migration completed successfully');
};

export const down = async () => {
  // Note: Down migration is not implemented as it would delete data
  // If needed, you would need to manually handle the rollback
  logger.warn('Down migration not implemented for database copy');
};
