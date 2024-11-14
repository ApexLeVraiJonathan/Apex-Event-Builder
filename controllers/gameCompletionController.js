import { saveGameCompletion } from '../services/gameCompletionService.js';
import {
  fetchGameResults,
  saveGameResults,
} from '../services/gameResultService.js';
import logger from '../utils/logger.js';

export const handleGameCompletionCallback = async (req, res, next) => {
  try {
    const gameData = req.body;

    // Validate required fields
    const requiredFields = [
      'startTime',
      'shortCode',
      'metaData',
      'gameId',
      'gameName',
      'gameType',
      'gameMap',
      'gameMode',
      'region',
    ];
    const missingFields = requiredFields.filter((field) => !gameData[field]);

    if (missingFields.length > 0) {
      logger.warn(`Missing fields: ${missingFields.join(', ')}`);
      return res
        .status(400)
        .json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }

    // Save the initial game completion data
    await saveGameCompletion(gameData);

    // Fetch the game results from Riot API
    const gameResults = await fetchGameResults(gameData.gameId);

    // Save the fetched game results to Cosmos DB
    await saveGameResults(gameData.gameId, gameResults);

    res
      .status(200)
      .json({ message: 'Game completion and results processed successfully' });
  } catch (error) {
    logger.error(`Failed to handle game completion callback: ${error.message}`);
    next(error);
  }
};
