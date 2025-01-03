import { CosmosClient } from '@azure/cosmos';
import { COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DATABASE } from '../config/env.js';
import logger from './logger.js';

class MigrationRunner {
  constructor() {
    this.client = new CosmosClient({
      endpoint: COSMOS_ENDPOINT,
      key: COSMOS_KEY,
    });
    this.database = this.client.database(COSMOS_DATABASE);
  }

  async initialize() {
    // Create migrations container if it doesn't exist
    const { container } = await this.database.containers.createIfNotExists({
      id: 'migrations',
      partitionKey: { paths: ['/id'] },
    });
    this.migrationsContainer = container;
  }

  async getCompletedMigrations() {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.completedAt ASC',
    };

    const { resources: completedMigrations } =
      await this.migrationsContainer.items.query(querySpec).fetchAll();

    return completedMigrations;
  }

  async recordMigration(migrationId) {
    await this.migrationsContainer.items.create({
      id: migrationId,
      completedAt: new Date().toISOString(),
    });
  }

  async runMigration(migration, migrationId, params = {}) {
    try {
      logger.info(`Starting migration: ${migrationId}`);
      await migration.up(this.client, this.database, params);
      await this.recordMigration(migrationId);
      logger.info(`Completed migration: ${migrationId}`);
    } catch (error) {
      logger.error(`Migration failed: ${migrationId}`, error);
      throw error;
    }
  }

  async runSpecificMigration(migrationId) {
    try {
      await this.initialize();

      // Find the specific migration
      const migration = await import(`../migrations/${migrationId}`);

      // Check if it's already been run
      const completed = await this.migrationsContainer
        .item(migrationId)
        .read()
        .then(() => true)
        .catch(() => false);

      if (completed) {
        logger.warn(`Migration ${migrationId} has already been run`);
        return;
      }

      // Run the migration
      await this.runMigration(migration, migrationId);
    } catch (error) {
      logger.error(`Failed to run migration ${migrationId}:`, error);
      throw error;
    }
  }

  async runMigrations(options = {}) {
    const { specific = null, until = null, from = null, params = {} } = options;

    try {
      await this.initialize();

      const completedMigrations = await this.getCompletedMigrations();
      const completedMigrationIds = new Set(
        completedMigrations.map((m) => m.id),
      );

      // List of all migrations in order
      const migrations = [
        {
          id: '001_initial_setup.js',
          module: await import('../migrations/001_initial_setup.js'),
        },
        {
          id: '002_copy_to_new_database.js',
          module: await import('../migrations/002_copy_to_new_database.js'),
        },
        {
          id: '003_add_new_container.js',
          module: await import('../migrations/003_add_new_container.js'),
        },
        {
          id: '004_add_new_index.js',
          module: await import('../migrations/004_add_new_index.js'),
        },
      ];

      if (specific) {
        const migration = migrations.find((m) => m.id === specific);
        if (!migration) {
          throw new Error(`Migration ${specific} not found`);
        }
        if (!completedMigrationIds.has(migration.id)) {
          await this.runMigration(migration.module, migration.id, params);
        }
        return;
      }

      // Filter migrations based on from/until options
      let migrationsToRun = migrations;
      if (from) {
        const fromIndex = migrations.findIndex((m) => m.id === from);
        if (fromIndex === -1) throw new Error(`Migration ${from} not found`);
        migrationsToRun = migrations.slice(fromIndex);
      }
      if (until) {
        const untilIndex = migrations.findIndex((m) => m.id === until);
        if (untilIndex === -1) throw new Error(`Migration ${until} not found`);
        migrationsToRun = migrationsToRun.slice(0, untilIndex + 1);
      }

      // Run pending migrations in order
      for (const { id, module } of migrationsToRun) {
        if (!completedMigrationIds.has(id)) {
          await this.runMigration(module, id, params);
        } else {
          logger.debug(`Skipping completed migration: ${id}`);
        }
      }

      logger.info('All specified migrations completed successfully');
    } catch (error) {
      logger.error('Migration process failed:', error);
      throw error;
    }
  }
}

export const migrationRunner = new MigrationRunner();
