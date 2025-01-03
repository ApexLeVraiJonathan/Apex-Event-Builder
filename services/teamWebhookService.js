import { BaseService } from './baseService.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { clearCache } from '../middlewares/cache.js';
import axios from 'axios'; // Need axios for Discord webhook calls

class TeamWebhookService extends BaseService {
  constructor() {
    super('teamWebhooks');
  }

  async registerWebhook(tournamentId, teamName, webhookData) {
    try {
      logger.info(
        `Registering webhook for team ${teamName} in tournament: ${tournamentId}`,
      );

      const webhook = await this.create({
        tournamentId,
        teamName,
        url: webhookData.webhookUrl,
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      clearCache(`tournament:${tournamentId}:webhooks`);
      return webhook;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error registering webhook:', error);
      throw new AppError('Failed to register webhook', 500);
    }
  }

  async getTeamWebhooks(tournamentId, teamName) {
    try {
      logger.info(
        `Fetching webhooks for team ${teamName} in tournament: ${tournamentId}`,
      );

      const querySpec = {
        query:
          'SELECT * FROM c WHERE c.tournamentId = @tournamentId AND c.teamName = @teamName',
        parameters: [
          { name: '@tournamentId', value: tournamentId },
          { name: '@teamName', value: teamName },
        ],
      };

      return await this.findMany(querySpec);
    } catch (error) {
      logger.error('Error fetching team webhooks:', error);
      throw new AppError('Failed to fetch team webhooks', 500);
    }
  }

  async getWebhooksForTeams(tournamentId, teamNames) {
    try {
      logger.info(
        `Fetching webhooks for teams ${teamNames.join(', ')} in tournament: ${tournamentId}`,
      );

      const querySpec = {
        query:
          'SELECT * FROM c WHERE c.tournamentId = @tournamentId AND ARRAY_CONTAINS(@teamNames, c.teamName)',
        parameters: [
          { name: '@tournamentId', value: tournamentId },
          { name: '@teamNames', value: teamNames },
        ],
      };

      return await this.findMany(querySpec);
    } catch (error) {
      logger.error('Error fetching team webhooks:', error);
      throw new AppError('Failed to fetch team webhooks', 500);
    }
  }

  async sendTournamentCodesNotification(webhook, teams, codes) {
    try {
      const message = {
        content: this.formatDiscordMessage(teams, codes),
        embeds: [
          {
            title: 'Tournament Codes Generated',
            color: 0x00ff00,
            fields: codes.map((code, index) => ({
              name: `Game ${index + 1}`,
              value: `\`${code}\``,
              inline: true,
            })),
          },
        ],
      };

      await axios.post(webhook.url, message);
      logger.info(
        `Successfully sent webhook notification to team ${webhook.teamName}`,
      );
    } catch (error) {
      logger.error(`Failed to send webhook notification: ${error.message}`);
      throw new AppError('Failed to send webhook notification', 500);
    }
  }

  formatDiscordMessage(teams, codes) {
    const header = `Tournament codes for:\n${teams[0]} VS ${teams[1]}\n`;
    const body = codes
      .map((code, index) => `Game ${index + 1}: ${code}`)
      .join('\n');
    const footer =
      '\n\nIf you have any issues with one of the codes, please contact an administrator.';

    return `${header}\nUse the following tournament codes to join your lobby:\n${body}${footer}`;
  }

  async deleteWebhook(tournamentId, teamName, webhookId) {
    try {
      logger.info(
        `Deleting webhook ${webhookId} for team ${teamName} in tournament: ${tournamentId}`,
      );

      const webhook = await this.findById(webhookId);
      if (!webhook) {
        throw new AppError('Webhook not found', 404);
      }

      if (
        webhook.tournamentId !== tournamentId ||
        webhook.teamName !== teamName
      ) {
        throw new AppError(
          'Webhook does not belong to this team/tournament',
          403,
        );
      }

      await this.delete(webhookId);
      clearCache(`tournament:${tournamentId}:webhooks`);
      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting webhook:', error);
      throw new AppError('Failed to delete webhook', 500);
    }
  }
}

export const teamWebhookService = new TeamWebhookService();
