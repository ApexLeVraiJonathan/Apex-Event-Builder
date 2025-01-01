import axios from 'axios';
import { getContainer } from '../config/cosmos.js';
import logger from '../utils/logger.js';
import { RIOT_API_KEY } from '../config/env.js';

const container = getContainer('tournamentProviders');

// Function to create a tournament provider using Riot API
export const createProvider = async (region, url) => {
  try {
    const response = await axios.post(
      `https://americas.api.riotgames.com/lol/tournament/v5/providers`,
      { region, url },
      {
        headers: { 'X-Riot-Token': RIOT_API_KEY },
      },
    );

    const providerId = response.data;
    logger.info(`Successfully created provider with ID: ${providerId}`);
    return providerId;
  } catch (error) {
    logger.error(`Riot API Error: ${error.message}`);
    throw error;
  }
};

// Function to check if a provider ID already exists in Cosmos DB using a query
const providerExists = async (providerId) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [{ name: '@id', value: providerId.toString() }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    return resources.length > 0;
  } catch (err) {
    logger.error(`Error checking provider existence: ${err.message}`);
    return false;
  }
};

// Function to save the provider ID to Cosmos DB
export const saveProviderId = async (providerId, region, url) => {
  try {
    // Check if the provider already exists
    const exists = await providerExists(providerId);
    if (exists) {
      logger.info(`Provider ID ${providerId} already exists. Skipping save.`);
      return { id: providerId, region, url };
    }

    // Save the provider if it doesn't already exist
    const item = {
      id: providerId.toString(),
      region,
      url,
      createdAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(item);
    logger.info(`Provider ID ${item.id} saved successfully`);
    return resource;
  } catch (err) {
    logger.error(`Error saving provider ID: ${err.message}`);
    throw err;
  }
};

// Function to list all providers from Cosmos DB
export const listProviders = async () => {
  try {
    const querySpec = {
      query: 'SELECT c.id, c.region, c.url FROM c',
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    logger.info(`Fetched ${resources.length} providers from the database`);
    return resources;
  } catch (error) {
    logger.error(`Error fetching providers: ${error.message}`);
    throw error;
  }
};
