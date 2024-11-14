import { getContainer } from '../config/cosmos.js';
import logger from '../utils/logger.js';

const container = getContainer('gameCompletions');

export const saveGameCompletion = async (gameData) => {
  try {
    const item = {
      id: gameData.gameId.toString(),
      ...gameData,
      receivedAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(item);
    logger.info(`Game completion saved with ID: ${item.id}`);
    return resource;
  } catch (err) {
    logger.error(`Error saving game completion: ${err.message}`);
    throw err;
  }
};
