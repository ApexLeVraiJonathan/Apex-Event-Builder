import axios from 'axios';
import { BaseService } from './baseService.js';
import { RIOT_API_KEY } from '../config/env.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

class GameResultService extends BaseService {
  constructor() {
    super('gameResults');
  }

  async fetchAndSaveGameResult(gameId) {
    try {
      logger.info(`Fetching and saving game results for gameId: ${gameId}`);

      // Fetch from Riot API
      const gameData = await this.fetchFromRiotApi(gameId);

      // Save to database
      const savedResult = await this.create({
        id: gameId.toString(),
        ...gameData,
        storedAt: new Date().toISOString(),
      });

      logger.info(`Successfully saved game results for gameId: ${gameId}`);
      return savedResult;
    } catch (error) {
      logger.error(`Error processing game results: ${error.message}`);
      throw new AppError('Failed to process game results', 500);
    }
  }

  async fetchFromRiotApi(gameId) {
    try {
      const transformedGameId = `NA1_${gameId}`;
      logger.info(
        `Fetching game results from Riot API for gameId: ${transformedGameId}`,
      );

      const response = await axios.get(
        `https://americas.api.riotgames.com/lol/match/v5/matches/${transformedGameId}`,
        {
          headers: { 'X-Riot-Token': RIOT_API_KEY },
        },
      );

      return response.data;
    } catch (error) {
      logger.error(`Error fetching from Riot API: ${error.message}`);
      throw new AppError('Failed to fetch game results from Riot API', 500);
    }
  }

  async getGameResult(gameId) {
    try {
      logger.info(`Retrieving game result for gameId: ${gameId}`);
      const result = await this.findById(gameId);

      if (!result) {
        throw new AppError('Game result not found', 404);
      }

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error retrieving game result: ${error.message}`);
      throw new AppError('Failed to retrieve game result', 500);
    }
  }
}

export const gameResultService = new GameResultService();
