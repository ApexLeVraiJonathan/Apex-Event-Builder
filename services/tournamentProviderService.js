import { getContainer } from '../config/cosmos.js';
import logger from '../utils/logger.js';

const container = getContainer('tournamentProviders');

export const saveProviderId = async (providerId, region, callbackUrl) => {
  try {
    const item = { id: providerId, region, callbackUrl };
    const { resource } = await container.items.create(item);
    logger.info(`Provider ID ${providerId} saved successfully`);
    return resource;
  } catch (err) {
    logger.error(`Error saving provider ID: ${err.message}`);
    throw err;
  }
};

export const getProviderById = async (providerId) => {
  try {
    const { resource } = await container.item(providerId).read();
    return resource;
  } catch (err) {
    logger.error(`Error retrieving provider ID: ${err.message}`);
    throw err;
  }
};
