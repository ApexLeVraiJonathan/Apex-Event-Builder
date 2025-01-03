import { BaseService } from './baseService.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { clearCache } from '../middlewares/cache.js';
import { gameResultService } from './gameResultService.js';

class GameCallbackService extends BaseService {
  constructor() {
    super('gameCallbacks');
  }

  async processCallback(callbackData) {
    try {
      logger.info(`Processing game callback for game: ${callbackData.gameId}`);

      // First, save the callback data
      const callback = await this.create({
        ...callbackData,
        receivedAt: new Date().toISOString(),
        status: 'received',
      });

      // Then trigger the result fetching process
      await gameResultService.fetchAndSaveGameResult(callbackData.gameId);

      // Update callback status
      const updatedCallback = await this.update(callback.id, {
        ...callback,
        status: 'processed',
        processedAt: new Date().toISOString(),
      });

      clearCache(`tournament:${callback.tournamentId}:games`);
      return updatedCallback;
    } catch (error) {
      logger.error('Error processing game callback:', error);
      throw new AppError('Failed to process game callback', 500);
    }
  }

  async getCallbacks(tournamentId) {
    try {
      logger.info(`Fetching game callbacks for tournament: ${tournamentId}`);
      return await this.findMany({ tournamentId });
    } catch (error) {
      logger.error('Error fetching game callbacks:', error);
      throw new AppError('Failed to fetch game callbacks', 500);
    }
  }

  async getCallback(tournamentId, callbackId) {
    try {
      logger.info(
        `Fetching callback ${callbackId} for tournament: ${tournamentId}`,
      );
      const callback = await this.findById(callbackId);

      if (!callback) {
        throw new AppError('Game callback not found', 404);
      }

      if (callback.tournamentId !== tournamentId) {
        throw new AppError(
          'Game callback does not belong to this tournament',
          403,
        );
      }

      return callback;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching game callback:', error);
      throw new AppError('Failed to fetch game callback', 500);
    }
  }
}

export const gameCallbackService = new GameCallbackService();
