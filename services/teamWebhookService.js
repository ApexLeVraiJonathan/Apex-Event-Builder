import { BaseService } from './baseService.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { clearCache } from '../middlewares/cache.js';
import axios from 'axios';

class TeamWebhookService extends BaseService {
  constructor() {
    super('teamWebhooks');
  }

  async validateWebhookUrl(webhookUrl) {
    try {
      await axios.post(
        webhookUrl,
        {
          type: 'ping',
          message: 'Testing webhook connection',
        },
        {
          timeout: 5000, // 5 second timeout
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      logger.error('Webhook validation failed:', error.message);
      throw new AppError(
        `Failed to validate webhook URL: ${error.message}`,
        400,
      );
    }
  }

  async registerWebhook(tournamentId, teamId, webhookData) {
    try {
      logger.info(
        `Registering webhook for team ${teamId} in tournament: ${tournamentId}`,
      );

      // Validate webhook URL first
      await this.validateWebhookUrl(webhookData.webhookUrl);

      const webhook = await this.create({
        tournamentId,
        teamId,
        ...webhookData,
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

  async getTeamWebhooks(tournamentId, teamId) {
    try {
      logger.info(
        `Fetching webhooks for team ${teamId} in tournament: ${tournamentId}`,
      );

      const querySpec = {
        query:
          'SELECT * FROM c WHERE c.tournamentId = @tournamentId AND c.teamId = @teamId',
        parameters: [
          { name: '@tournamentId', value: tournamentId },
          { name: '@teamId', value: teamId },
        ],
      };

      return await this.findMany(querySpec);
    } catch (error) {
      logger.error('Error fetching team webhooks:', error);
      throw new AppError('Failed to fetch team webhooks', 500);
    }
  }

  async deleteWebhook(tournamentId, teamId, webhookId) {
    try {
      logger.info(
        `Deleting webhook ${webhookId} for team ${teamId} in tournament: ${tournamentId}`,
      );

      const webhook = await this.findById(webhookId);
      if (!webhook) {
        throw new AppError('Webhook not found', 404);
      }

      if (webhook.tournamentId !== tournamentId || webhook.teamId !== teamId) {
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

  async notifyWebhook(webhook, event, data) {
    try {
      logger.info(`Notifying webhook ${webhook.id} for event: ${event}`);

      const payload = {
        event,
        timestamp: new Date().toISOString(),
        data,
      };

      await axios.post(webhook.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000, // 5 second timeout
      });

      logger.info(`Successfully notified webhook ${webhook.id}`);
      return true;
    } catch (error) {
      logger.error(`Failed to notify webhook ${webhook.id}:`, error);
      return false;
    }
  }
}

export const teamWebhookService = new TeamWebhookService();
