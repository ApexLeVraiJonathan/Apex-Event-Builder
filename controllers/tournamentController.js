import {
  createTournament,
  saveTournamentId,
} from '../services/tournamentService.js';
import logger from '../utils/logger.js';

export const handleCreateTournament = async (req, res) => {
  const { providerId, name } = req.body;

  if (!providerId || !name) {
    logger.warn('Missing providerId or name in request body');
    return res
      .status(400)
      .json({ error: 'Provider ID and tournament name are required' });
  }

  try {
    const tournamentId = await createTournament(providerId, name);
    await saveTournamentId(tournamentId, providerId, name);

    res.status(201).json({ tournamentId });
  } catch (error) {
    logger.error(`Failed to create tournament: ${error.message}`);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
};