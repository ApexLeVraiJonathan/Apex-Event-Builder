import {
  createTournamentCodes,
  saveTournamentCodes,
} from '../services/tournamentCodeService.js';
import { getTeamWebhook } from '../controllers/teamWebhookController.js';
import { sendToDiscord as sendDiscordMessage } from '../services/discordWebhookService.js'; // Renamed for clarity
import logger from '../utils/logger.js';

export const handleCreateTournamentCodes = async (req, res, next) => {
  const { tournamentId, count, sendToDiscord } = req.query;
  const {
    enoughPlayers,
    mapType,
    metadata,
    pickType,
    spectatorType,
    teamSize,
    teams,
  } = req.body;

  if (!tournamentId || !count) {
    logger.warn('Missing tournamentId or count in query parameters');
    return res
      .status(400)
      .json({ error: 'tournamentId and count are required' });
  }

  if (!Array.isArray(teams) || teams.length < 2) {
    logger.warn('Teams array must contain at least two teams');
    return res.status(400).json({
      error:
        'Two team names are required to create tournament codes with Discord notifications',
    });
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

    // Save tournament codes in the database
    await saveTournamentCodes(tournamentId, codes, config);

    // Optionally send to Discord channels
    if (sendToDiscord === 'true') {
      for (const team of teams) {
        try {
          const webhook = await getTeamWebhook(tournamentId, team);
          if (webhook) {
            // Construct the message
            const formattedMessage = formatDiscordMessage(teams, codes); // Pass full teams array
            await sendDiscordMessage(webhook.webhookUrl, formattedMessage);
          } else {
            logger.warn(`No webhook found for team: ${team}`);
          }
        } catch (err) {
          logger.error(`Error sending codes to team ${team}: ${err.message}`);
        }
      }
    }

    res.status(201).json({ codes });
  } catch (error) {
    logger.error(`Failed to create tournament codes: ${error.message}`);
    next(error);
  }
};

// Function to format the Discord message
const formatDiscordMessage = (teams, codes) => {
  const header = `Tournament codes for:\n@${teams[0]} VS @${teams[1]}\n`;
  const body = codes
    .map((code, index) => `Game ${index + 1}: ${code}`)
    .join('\n');
  const footer =
    '\n\nIf you have any issues with one of the codes, please contact an administrator.';

  return `${header}\nUse the following tournament codes to join your lobby:\n${body}${footer}`;
};
