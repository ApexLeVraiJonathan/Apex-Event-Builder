import axios from 'axios';
import logger from '../utils/logger.js';
import { RIOT_API_KEY, RIOT_TOURNAMENT_API_URL } from '../config/env.js';
import { BaseService } from './baseService.js';
import { AppError } from '../utils/errors.js';

class TournamentService extends BaseService {
  constructor() {
    super('tournaments');
  }

  // Create tournament in Riot's system
  async createRiotTournament(providerId, name = '') {
    try {
      logger.info('Creating tournament with Riot API', { providerId, name });

      const response = await axios.post(
        `${RIOT_TOURNAMENT_API_URL}/lol/tournament/v5/tournaments`,
        {
          providerId: parseInt(providerId, 10), // Ensure providerId is an integer
          name: name || '', // Ensure name is a string, default to empty string if not provided
        },
        {
          headers: {
            'X-Riot-Token': RIOT_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      const tournamentId = response.data;
      logger.info(
        `Successfully created Riot tournament with ID: ${tournamentId}`,
      );
      return tournamentId;
    } catch (error) {
      logger.error('Error creating Riot tournament:', {
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
      throw new AppError('Failed to create tournament in Riot system', 500);
    }
  }

  // Save tournament in our database
  async saveTournament(tournamentData) {
    try {
      logger.info('Creating tournament in database');
      return await this.create({
        ...tournamentData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      logger.error(`Error saving tournament: ${error.message}`);
      throw new AppError('Failed to save tournament', 500);
    }
  }

  // Get tournament by ID (using base service)
  async getTournament(id) {
    try {
      logger.info(`Fetching tournament with ID: ${id}`);
      const tournament = await this.findById(id);

      if (!tournament) {
        throw new AppError('Tournament not found', 404);
      }

      return tournament;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error fetching tournament: ${error.message}`);
      throw new AppError('Failed to fetch tournament', 500);
    }
  }

  // List all tournaments (using base service)
  async listTournaments() {
    try {
      logger.info('Fetching tournaments list');
      return await this.findMany('SELECT * FROM c');
    } catch (error) {
      logger.error(`Error listing tournaments: ${error.message}`);
      throw new AppError('Failed to list tournaments', 500);
    }
  }
}

// Create service instance without initializing
const tournamentService = new TournamentService();

// Export the service
export { tournamentService };
