import { containers } from '../config/cosmos.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export class BaseService {
  constructor() {
    this.container = null;
  }

  async init(containerName) {
    if (!containerName) {
      throw new Error('Container name is required');
    }

    this.container = containers.get(containerName);
    if (!this.container) {
      throw new Error(`Container ${containerName} not found`);
    }
  }

  async findMany(query = 'SELECT * FROM c') {
    if (!this.container) {
      throw new Error('Service not initialized');
    }

    try {
      const { resources } = await this.container.items.query(query).fetchAll();
      return resources;
    } catch (error) {
      logger.error(`Error in findMany for ${this.container.id}:`, error);
      throw new AppError(`Database error in ${this.container.id}`, 500);
    }
  }

  async findById(id) {
    if (!this.container) {
      throw new Error('Service not initialized');
    }

    try {
      logger.debug(
        `Attempting to find item with ID: ${id} in container: ${this.container.id}`,
      );
      const { resource } = await this.container.item(id, id).read();

      if (!resource) {
        logger.debug(`No resource found for ID: ${id}`);
        return null;
      }

      logger.debug(`Found resource:`, resource);
      return resource;
    } catch (error) {
      logger.error(`Error in findById for ${this.container.id}:`, {
        id,
        errorCode: error.code,
        errorMessage: error.message,
        stack: error.stack,
      });

      if (error.code === 404) {
        return null;
      }
      throw new AppError(
        `Database error in ${this.container.id}: ${error.message}`,
        500,
      );
    }
  }

  async findOne(query) {
    try {
      const { resources } = await this.container.items.query(query).fetchAll();
      return resources[0] || null;
    } catch (error) {
      logger.error(`Error in findOne for ${this.container.id}:`, error);
      throw new AppError(`Database error in ${this.container.id}`, 500);
    }
  }

  async create(data) {
    try {
      const { resource } = await this.container.items.create(data);
      return resource;
    } catch (error) {
      logger.error(`Error in create for ${this.container.id}:`, error);
      throw new AppError(`Database error in ${this.container.id}`, 500);
    }
  }

  async update(id, data) {
    try {
      const { resource } = await this.container.item(id).replace(data);
      return resource;
    } catch (error) {
      if (error.code === 404) {
        throw new AppError('Resource not found', 404);
      }
      logger.error(`Error in update for ${this.container.id}:`, error);
      throw new AppError(`Database error in ${this.container.id}`, 500);
    }
  }

  async delete(id) {
    try {
      await this.container.item(id).delete();
      return true;
    } catch (error) {
      if (error.code === 404) {
        return false;
      }
      logger.error(`Error in delete for ${this.container.id}:`, error);
      throw new AppError(`Database error in ${this.container.id}`, 500);
    }
  }
}
