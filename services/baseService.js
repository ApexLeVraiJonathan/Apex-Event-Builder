import { getContainer } from '../config/cosmos.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export class BaseService {
  constructor(containerName) {
    this.containerName = containerName;
    this.container = null;
  }

  async ensureContainer() {
    if (!this.container) {
      this.container = await getContainer(this.containerName);
    }
    return this.container;
  }

  async findMany(query = 'SELECT * FROM c') {
    try {
      const container = await this.ensureContainer();
      const { resources } = await container.items.query(query).fetchAll();
      return resources;
    } catch (error) {
      logger.error(`Error in findMany for ${this.containerName}:`, error);
      throw new AppError(`Database error in ${this.containerName}`, 500);
    }
  }

  async findById(id) {
    try {
      const container = await this.ensureContainer();
      logger.debug(
        `Attempting to find item with ID: ${id} in container: ${this.containerName}`,
      );

      const { resource } = await container.item(id, id).read();

      if (!resource) {
        logger.debug(`No resource found for ID: ${id}`);
        return null;
      }

      logger.debug(`Found resource:`, resource);
      return resource;
    } catch (error) {
      logger.error(`Error in findById for ${this.containerName}:`, {
        id,
        errorCode: error.code,
        errorMessage: error.message,
        stack: error.stack,
      });

      if (error.code === 404) {
        return null;
      }
      throw new AppError(
        `Database error in ${this.containerName}: ${error.message}`,
        500,
      );
    }
  }

  async findOne(query) {
    try {
      const container = await this.ensureContainer();
      const { resources } = await container.items.query(query).fetchAll();
      return resources[0] || null;
    } catch (error) {
      logger.error(`Error in findOne for ${this.containerName}:`, error);
      throw new AppError(`Database error in ${this.containerName}`, 500);
    }
  }

  async create(data) {
    try {
      const container = await this.ensureContainer();
      const { resource } = await container.items.create(data);
      return resource;
    } catch (error) {
      logger.error(`Error in create for ${this.containerName}:`, error);
      throw new AppError(`Database error in ${this.containerName}`, 500);
    }
  }

  async update(id, data) {
    try {
      const container = await this.ensureContainer();
      const { resource } = await container.item(id).replace(data);
      return resource;
    } catch (error) {
      if (error.code === 404) {
        throw new AppError('Resource not found', 404);
      }
      logger.error(`Error in update for ${this.containerName}:`, error);
      throw new AppError(`Database error in ${this.containerName}`, 500);
    }
  }

  async delete(id) {
    try {
      const container = await this.ensureContainer();
      await container.item(id, id).delete();
      return true;
    } catch (error) {
      if (error.code === 404) {
        return false;
      }
      logger.error(`Error in delete for ${this.containerName}:`, error);
      throw new AppError(`Database error in ${this.containerName}`, 500);
    }
  }
}
