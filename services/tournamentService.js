import axios from 'axios';
import { getContainer } from '../config/cosmos.js';
import logger from '../utils/logger.js';
import { RIOT_API_KEY } from '../config/env.js';

const container = getContainer('tournaments');

export const createTournament = async (providerId, name) => {
  try {
    const response = await axios.post(
      `https://americas.api.riotgames.com/lol/tournament/v5/tournaments`,
      { providerId, name },
      {
        headers: { 'X-Riot-Token': RIOT_API_KEY },
      },
    );

    const tournamentId = response.data;
    logger.info(`Successfully created tournament with ID: ${tournamentId}`);
    return tournamentId;
  } catch (error) {
    logger.error(`Error creating tournament: ${error.message}`);
    throw error;
  }
};

export const saveTournamentId = async (tournamentId, providerId, name) => {
  try {
    const item = {
      id: tournamentId.toString(),
      providerId: providerId.toString(),
      name,
      createdAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(item);
    logger.info(`Tournament ID ${item.id} saved successfully`);
    return resource;
  } catch (err) {
    logger.error(`Error saving tournament ID: ${err.message}`);
    throw err;
  }
};

export const listTournaments = async () => {
  try {
    const querySpec = {
      query: 'SELECT c.id, c.name FROM c',
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    logger.info(`Fetched ${resources.length} tournaments from the database`);
    return resources;
  } catch (error) {
    logger.error(`Error fetching tournaments: ${error.message}`);
    throw error;
  }
};
