import { BaseService } from './baseService.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { clearCache } from '../middlewares/cache.js';

class TournamentCodeService extends BaseService {
  constructor() {
    super('tournamentCodes');
  }

  async createCode(tournamentId, data) {
    try {
      logger.info(`Creating tournament code for tournament: ${tournamentId}`);
      const code = await this.create({
        ...data,
        tournamentId,
        createdAt: new Date().toISOString(),
        status: 'active',
      });

      clearCache(`tournament:${tournamentId}:codes`);
      return code;
    } catch (error) {
      logger.error('Error creating tournament code:', error);
      throw new AppError('Failed to create tournament code', 500);
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

  async invalidateCode(tournamentId, codeId) {
    try {
      logger.info(
        `Invalidating code ${codeId} for tournament: ${tournamentId}`,
      );

      const code = await this.findById(codeId);
      if (!code) {
        throw new AppError('Tournament code not found', 404);
      }

      if (code.tournamentId !== tournamentId) {
        throw new AppError(
          'Tournament code does not belong to this tournament',
          403,
        );
      }

      const updatedCode = await this.update(codeId, {
        ...code,
        status: 'invalid',
        updatedAt: new Date().toISOString(),
      });

      clearCache(`tournament:${tournamentId}:codes`);
      return updatedCode;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error invalidating tournament code:', error);
      throw new AppError('Failed to invalidate tournament code', 500);
    }
  }

  async getCode(tournamentId, codeId) {
    try {
      logger.info(`Fetching code ${codeId} for tournament: ${tournamentId}`);
      const code = await this.findById(codeId);

      if (!code) {
        throw new AppError('Tournament code not found', 404);
      }

      if (code.tournamentId !== tournamentId) {
        throw new AppError(
          'Tournament code does not belong to this tournament',
          403,
        );
      }

      return code;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching tournament code:', error);
      throw new AppError('Failed to fetch tournament code', 500);
    }
  }
}

export const tournamentCodeService = new TournamentCodeService();
