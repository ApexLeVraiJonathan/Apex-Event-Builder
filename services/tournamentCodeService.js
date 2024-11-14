import axios from 'axios';
import { getContainer } from '../config/cosmos.js';
import { RIOT_API_KEY } from '../config/env.js';
import logger from '../utils/logger.js';

const container = getContainer('tournamentCodes');

export const createTournamentCodes = async (tournamentId, count, config) => {
  try {
    const response = await axios.post(
      `https://americas.api.riotgames.com/lol/tournament/v5/codes?tournamentId=${tournamentId}&count=${count}`,
      {
        enoughPlayers: config.enoughPlayers,
        mapType: config.mapType,
        metadata: config.metadata,
        pickType: config.pickType,
        spectatorType: config.spectatorType,
        teamSize: config.teamSize,
      },
      {
        headers: { 'X-Riot-Token': RIOT_API_KEY },
      },
    );

    const codes = response.data;
    logger.info(`Successfully generated ${codes.length} tournament codes`);
    return codes;
  } catch (error) {
    logger.error(`Error creating tournament codes: ${error.message}`);
    throw error;
  }
};

export const saveTournamentCodes = async (tournamentId, codes, config) => {
  try {
    if (!Array.isArray(codes) || codes.length === 0) {
      throw new Error('No tournament codes to save');
    }

    const operations = codes.map((code) => ({
      id: code,
      tournamentId: tournamentId.toString(),
      ...config,
      createdAt: new Date().toISOString(),
    }));

    // Insert each tournament code individually
    for (const operation of operations) {
      await container.items.create(operation);
      logger.info(
        `Successfully saved tournament code with id: ${operation.id}`,
      );
    }

    return operations;
  } catch (err) {
    logger.error(`Error saving tournament codes: ${err.message}`);
    throw err;
  }
};
