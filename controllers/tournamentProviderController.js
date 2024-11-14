import {
  createProvider,
  saveProviderId,
} from '../services/tournamentProviderService.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

export const handleCreateProvider = async (req, res) => {
  const { region, url } = req.body;

  if (!region || !url) {
    logger.warn('Missing region or url in the request body');
    return res.status(400).json({ error: 'Region and url are required' });
  }

  try {
    // Create a tournament provider using the service
    const providerId = await createProvider(region, url);

    // Save the provider ID to Cosmos DB
    await saveProviderId(providerId, region, url);

    res.status(201).json({ providerId });
  } catch (error) {
    logger.error(`Failed to create tournament provider: ${error.message}`);
    res.status(500).json({ error: 'Failed to create tournament provider' });
  }
};
