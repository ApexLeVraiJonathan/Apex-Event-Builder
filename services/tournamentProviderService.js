import { BaseService } from './baseService.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { clearCache } from '../middlewares/cache.js';
import axios from 'axios';
import { RIOT_API_KEY, RIOT_TOURNAMENT_API_URL } from '../config/env.js';

class TournamentProviderService extends BaseService {
  constructor() {
    super();
    this.containerName = 'tournamentProviders';
  }

  async init() {
    await super.init(this.containerName);
  }

  async createProvider(data) {
    try {
      logger.info('Creating tournament provider with Riot API');

      // Check if provider already exists with same region and url
      const existingProvider = await this.findMany(
        `SELECT * FROM c WHERE c.region = "${data.region}" AND c.url = "${data.url}"`,
      );

      if (existingProvider && existingProvider.length > 0) {
        logger.warn('Provider already exists with these parameters:', {
          region: data.region,
          url: data.url,
          existingId: existingProvider[0].id,
        });
        throw new AppError(
          'Provider already exists with these parameters',
          409,
        );
      }

      // Log the request data for debugging
      logger.debug('Request data:', { region: data.region, url: data.url });

      // 1. Create provider with Riot API
      const riotResponse = await axios.post(
        `${RIOT_TOURNAMENT_API_URL}/lol/tournament/v5/providers`,
        {
          region: data.region,
          url: data.url,
        },
        {
          headers: {
            'X-Riot-Token': RIOT_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      // 2. Check Riot API response
      if (!riotResponse.data) {
        throw new AppError('Failed to create provider with Riot API', 500);
      }

      const providerId = riotResponse.data;
      logger.info(`Riot API provider created with ID: ${providerId}`);

      // 3. Save to our database using the Riot provider ID as our document ID
      const providerData = {
        id: providerId.toString(),
        region: data.region,
        url: data.url,
        createdAt: new Date().toISOString(),
        type: 'provider', // Adding a type field for Cosmos DB
      };

      logger.debug('Attempting to save to database:', providerData);

      const provider = await this.create(providerData);

      // 4. Verify database save was successful
      if (!provider) {
        logger.error('Database save returned null or undefined');
        throw new AppError('Failed to save provider to database', 500);
      }

      logger.info('Provider successfully saved to database:', provider.id);
      clearCache('providers');
      return provider;
    } catch (error) {
      if (error instanceof AppError) throw error;

      logger.error('Error creating tournament provider:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response) {
        throw new AppError(
          `Riot API Error: ${error.response.data.status?.message || 'Unknown error'}`,
          error.response.status,
        );
      }
      throw new AppError('Failed to create tournament provider', 500);
    }
  }

  async getProvider(id) {
    try {
      logger.info(`Fetching provider with ID: ${id}`);
      const provider = await this.findById(id);

      if (!provider) {
        throw new AppError('Tournament provider not found', 404);
      }

      logger.debug('Found provider:', provider);
      return provider;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching tournament provider:', error);
      throw new AppError('Failed to fetch tournament provider', 500);
    }
  }

  async listProviders() {
    try {
      logger.info('Listing tournament providers');
      return await this.findMany('SELECT c.id, c.region, c.url FROM c');
    } catch (error) {
      logger.error('Error listing tournament providers:', error);
      throw new AppError('Failed to list tournament providers', 500);
    }
  }
}

export const tournamentProviderService = new TournamentProviderService();
