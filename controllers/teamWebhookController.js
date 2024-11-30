import { getContainer } from '../config/cosmos.js';
import logger from '../utils/logger.js';

const container = getContainer('teamWebhooks');

// Add a new team webhook entry
export const addTeamWebhook = async (req, res, next) => {
  const { tournamentId, tournamentName, teamName, webhookUrl } = req.body;

  if (!tournamentId || !tournamentName || !teamName || !webhookUrl) {
    logger.warn(
      'Missing required fields: tournamentId, tournamentName, teamName, or webhookUrl',
    );
    return res.status(400).json({
      error:
        'tournamentId, tournamentName, teamName, and webhookUrl are required',
    });
  }

  try {
    const item = {
      id: `${tournamentId}_${teamName.toLowerCase()}`, // Unique ID combining tournamentId and teamName
      tournamentId,
      tournamentName,
      teamName,
      webhookUrl,
      createdAt: new Date().toISOString(),
    };

    const { resource } = await container.items.create(item);
    logger.info(
      `Webhook added for team: ${teamName} in tournament: ${tournamentName}`,
    );
    res.status(201).json(resource);
  } catch (error) {
    logger.error(`Error adding team webhook: ${error.message}`);
    next(error);
  }
};

// Retrieve a webhook for a specific team and tournament
export const getTeamWebhook = async (tournamentId, teamName) => {
  try {
    // Construct the ID as stored in the database
    const id = `${tournamentId}_${teamName.toLowerCase()}`;
    logger.info(`Fetching webhook with ID: ${id}`);

    // Include the partition key (id) in the read operation
    const { resource } = await container.item(id, id).read();

    if (!resource) {
      logger.warn(`No webhook found for ID: ${id}`);
    } else {
      logger.info(`Found webhook for ID: ${id}`);
    }

    return resource;
  } catch (error) {
    logger.error(
      `Error fetching webhook for team ${teamName} in tournament ${tournamentId}: ${error.message}`,
    );
    return null; // Return null if not found
  }
};
