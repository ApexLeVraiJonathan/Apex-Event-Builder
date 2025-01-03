import express from 'express';
import {
  handleRegisterWebhook,
  handleGetTeamWebhooks,
  handleDeleteWebhook,
} from '../controllers/teamWebhookController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { registerWebhookSchema } from '../schemas/webhook.schema.js';
import { defaultLimiter } from '../middlewares/rateLimiter.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

/**
 * @swagger
 * /tournaments/{tournamentId}/teams/{teamId}/webhooks:
 *   post:
 *     summary: Register a new webhook
 *     tags: [Webhooks]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - webhookUrl
 *             properties:
 *               webhookUrl:
 *                 type: string
 *                 format: uri
 *               secret:
 *                 type: string
 *               events:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Webhook registered successfully
 *       400:
 *         $ref: '#/components/responses/Error'
 */
router.post(
  '/:tournamentId/teams/:teamId/webhooks',
  defaultLimiter,
  validateRequest(registerWebhookSchema),
  handleRegisterWebhook,
);

/**
 * @swagger
 * /tournaments/{tournamentId}/teams/{teamId}/webhooks:
 *   get:
 *     summary: Get team webhooks
 *     tags: [Webhooks]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of webhooks
 */
router.get(
  '/:tournamentId/teams/:teamId/webhooks',
  defaultLimiter,
  cacheMiddleware('webhooks'),
  handleGetTeamWebhooks,
);

/**
 * @swagger
 * /tournaments/{tournamentId}/teams/{teamId}/webhooks/{webhookId}:
 *   delete:
 *     summary: Delete webhook
 *     tags: [Webhooks]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: webhookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook deleted successfully
 *       404:
 *         $ref: '#/components/responses/Error'
 */
router.delete(
  '/:tournamentId/teams/:teamId/webhooks/:webhookId',
  defaultLimiter,
  handleDeleteWebhook,
);

export default router;
