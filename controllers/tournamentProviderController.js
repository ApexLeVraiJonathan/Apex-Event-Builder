import { saveProviderId } from '../services/tournamentProviderService.js';
import dotenv from 'dotenv';
import axios from 'axios';
import logger from '../utils/logger.js';

// Load environment variables from .env file
dotenv.config();

export const createTournamentProvider = async (req, res) => {
  const { region, callbackUrl } = req.body;

  try {
    const response = await axios.post(
      `https://americas.api.riotgames.com/lol/tournament/v5/providers`,
      { region, url: callbackUrl },
      { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY } },
    );

    const providerId = response.data;
    await saveProviderId(providerId, region, callbackUrl);

    res.status(201).json({ providerId });
  } catch (error) {
    logger.error(`Failed to create tournament provider: ${error.message}`);
    res.status(500).json({ error: 'Failed to create tournament provider' });
  }
};
