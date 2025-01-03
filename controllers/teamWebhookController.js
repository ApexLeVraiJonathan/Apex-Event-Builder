import logger from '../utils/logger.js';
import { teamWebhookService } from '../services/teamWebhookService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const handleRegisterWebhook = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId, teamId } = req.params;
  const webhookData = req.sanitizedBody;

  try {
    logger.info({
      correlationId,
      message: 'Registering team webhook',
      tournamentId,
      teamId,
    });

    const webhook = await teamWebhookService.registerWebhook(
      tournamentId,
      teamId,
      webhookData,
    );

    logger.info({
      correlationId,
      message: 'Team webhook registered successfully',
      webhookId: webhook.id,
    });

    return ApiResponse.created(res, { webhook });
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to register team webhook',
      error: error.message,
    });
    next(error);
  }
};

export const handleGetTeamWebhooks = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId, teamId } = req.params;

  try {
    logger.info({
      correlationId,
      message: 'Fetching team webhooks',
      tournamentId,
      teamId,
    });

    const webhooks = await teamWebhookService.getTeamWebhooks(
      tournamentId,
      teamId,
    );

    logger.info({
      correlationId,
      message: 'Team webhooks fetched successfully',
      count: webhooks.length,
    });

    return ApiResponse.success(res, { webhooks });
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to fetch team webhooks',
      error: error.message,
    });
    next(error);
  }
};

export const handleDeleteWebhook = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId, teamId, webhookId } = req.params;

  try {
    logger.info({
      correlationId,
      message: 'Deleting team webhook',
      tournamentId,
      teamId,
      webhookId,
    });

    await teamWebhookService.deleteWebhook(tournamentId, teamId, webhookId);

    logger.info({
      correlationId,
      message: 'Team webhook deleted successfully',
      webhookId,
    });

    return ApiResponse.success(res, null, 'Webhook deleted successfully');
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to delete team webhook',
      error: error.message,
    });
    next(error);
  }
};
