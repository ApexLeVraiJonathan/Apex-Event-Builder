import {
  createTournamentCodes,
  saveTournamentCodes,
} from '../services/tournamentCodeService.js';
import logger from '../utils/logger.js';

export const handleCreateTournamentCodes = async (req, res) => {
  const { tournamentId, count } = req.query;
  const {
    enoughPlayers,
    mapType,
    metadata,
    pickType,
    spectatorType,
    teamSize,
  } = req.body;

  // Validate query parameters
  if (!tournamentId || !count) {
    logger.warn('Missing tournamentId or count in query parameters');
    return res
      .status(400)
      .json({ error: 'tournamentId and count are required' });
  }

  // Validate body parameters
  if (!mapType || !metadata || !pickType || !spectatorType || !teamSize) {
    logger.warn('Missing required fields in request body');
    return res
      .status(400)
      .json({ error: 'All required fields are missing in request body' });
  }

  try {
    const config = {
      enoughPlayers,
      mapType,
      metadata,
      pickType,
      spectatorType,
      teamSize,
    };
    const codes = await createTournamentCodes(tournamentId, count, config);
    await saveTournamentCodes(tournamentId, codes, config);

    res.status(201).json({ codes });
  } catch (error) {
    logger.error(`Failed to create tournament codes: ${error.message}`);
    res.status(500).json({ error: 'Failed to create tournament codes' });
  }
};
