import axios from 'axios';
import { getContainer } from '../config/cosmos.js';
import { RIOT_API_KEY } from '../config/env.js';
import logger from '../utils/logger.js';

const container = getContainer('gameResults');

// Function to fetch game results from Riot API
export const fetchGameResults = async (gameId) => {
  try {
    // Prepend 'NA1_' to the gameId
    const transformedGameId = `NA1_${gameId}`;

    const response = await axios.get(
      `https://americas.api.riotgames.com/lol/match/v5/matches/${transformedGameId}`,
      {
        headers: { 'X-Riot-Token': RIOT_API_KEY },
      },
    );

    const gameResult = response.data;
    logger.info(
      `Successfully fetched game results for gameId: ${transformedGameId}`,
    );
    return gameResult;
  } catch (error) {
    logger.error(`Error fetching game results: ${error.message}`);
    throw error;
  }
};

// Function to save game results to Cosmos DB
export const saveGameResults = async (gameId, gameResult) => {
  try {
    const item = {
      id: gameId.toString(),
      ...gameResult,
      storedAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(item);
    logger.info(`Game results saved with ID: ${item.id}`);
    return resource;
  } catch (err) {
    logger.error(`Error saving game results: ${err.message}`);
    throw err;
  }
};
