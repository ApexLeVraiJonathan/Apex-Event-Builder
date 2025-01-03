import { migrationRunner } from '../utils/migrationRunner.js';
import logger from '../utils/logger.js';

const runMigrations = async () => {
  try {
    const options = {
      specific: process.argv[2], // e.g., npm run migrate 002_copy_to_new_database.js
      from: process.argv[3], // e.g., npm run migrate -- null 002_copy_to_new_database.js
      until: process.argv[4], // e.g., npm run migrate -- null null 004_add_new_index.js
    };

    await migrationRunner.runMigrations(options);
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
