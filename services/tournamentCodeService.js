import axios from 'axios';
import { BaseService } from './baseService.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { clearCache } from '../middlewares/cache.js';
import { RIOT_API_KEY, RIOT_TOURNAMENT_API_URL } from '../config/env.js';
import { teamWebhookService } from './teamWebhookService.js';

class TournamentCodeService extends BaseService {
  constructor() {
    super('tournamentCodes');
  }

  async createCodes(tournamentId, data, count = 1) {
    try {
      logger.info('Creating tournament codes:', {
        count,
        tournamentId,
        requestData: data,
      });

      // Format request for Riot API
      const riotRequest = {
        teamSize: Number(data.teamSize),
        mapType: data.mapType,
        pickType: data.pickType,
        spectatorType: data.spectatorType,
        metadata:
          typeof data.metadata === 'object'
            ? JSON.stringify(data.metadata)
            : data.metadata || '',
      };

      logger.debug('Riot API request:', { riotRequest });

      // Create codes with Riot API
      const response = await axios.post(
        `${RIOT_TOURNAMENT_API_URL}/lol/tournament/v5/codes`,
        riotRequest,
        {
          params: {
            tournamentId: Number(tournamentId),
            count: Number(count),
          },
          headers: {
            'X-Riot-Token': RIOT_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      const codes = response.data;
      logger.info(`Successfully created ${codes.length} codes with Riot API`);

      // 2. Save codes to our database
      const savedCodes = await Promise.all(
        codes.map((code) =>
          this.create({
            code,
            tournamentId,
            teams: data.teams,
            ...data,
            status: 'active',
            createdAt: new Date().toISOString(),
          }),
        ),
      );

      // 3. If teams are provided, notify their webhooks
      if (data.teams && data.teams.length === 2) {
        try {
          const webhooks = await teamWebhookService.getWebhooksForTeams(
            tournamentId,
            data.teams,
          );

          // Send notifications in parallel
          await Promise.all(
            webhooks.map((webhook) =>
              teamWebhookService
                .sendTournamentCodesNotification(webhook, data.teams, codes)
                .catch((error) => {
                  // Log error but don't fail the operation
                  logger.error('Failed to send webhook notification:', error);
                }),
            ),
          );
        } catch (error) {
          // Log webhook errors but don't fail the code creation
          logger.error('Error processing webhooks:', error);
        }
      }

      // 4. Clear cache
      clearCache(`tournament:${tournamentId}:codes`);

      return savedCodes;
    } catch (error) {
      logger.error('Error creating tournament codes:', {
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
      throw new AppError('Failed to create tournament codes', 500);
    }
  }

  async getCodes(tournamentId, query = {}) {
    try {
      logger.info(`Fetching codes for tournament: ${tournamentId}`);
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.tournamentId = @tournamentId',
        parameters: [
          {
            name: '@tournamentId',
            value: tournamentId,
          },
        ],
      };

      if (query.status) {
        querySpec.query += ' AND c.status = @status';
        querySpec.parameters.push({
          name: '@status',
          value: query.status,
        });
      }

      return await this.findMany(querySpec);
    } catch (error) {
      logger.error('Error fetching tournament codes:', error);
      throw new AppError('Failed to fetch tournament codes', 500);
    }
  }

  async getCode(code) {
    try {
      logger.info(`Fetching tournament code: ${code}`);

      const querySpec = {
        query: 'SELECT * FROM c WHERE c.code = @code',
        parameters: [
          {
            name: '@code',
            value: code,
          },
        ],
      };

      const codes = await this.findMany(querySpec);
      return codes[0] || null;
    } catch (error) {
      logger.error('Error fetching tournament code:', error);
      throw new AppError('Failed to fetch tournament code', 500);
    }
  }
}

export const tournamentCodeService = new TournamentCodeService();
