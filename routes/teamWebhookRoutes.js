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
 * /team-webhooks/{tournamentId}:
 *   post:
 *     summary: Register a Discord webhook for tournament notifications
 *     tags: [Webhooks]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The tournament ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamName
 *               - webhookUrl
 *             properties:
 *               teamName:
 *                 type: string
 *                 description: Team name that will be used in tournament codes
 *               webhookUrl:
 *                 type: string
 *                 format: uri
 *                 pattern: ^https:\/\/discord\.com\/api\/webhooks\/.*
 *                 description: Discord webhook URL
 *     responses:
 *       201:
 *         description: Webhook registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WebhookResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post(
  '/:tournamentId',
  defaultLimiter,
  validateRequest(registerWebhookSchema),
  handleRegisterWebhook,
);

/**
 * @swagger
 * /team-webhooks/{tournamentId}/{teamName}:
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
 *         name: teamName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of webhooks
 */
router.get(
  '/:tournamentId/:teamName',
  defaultLimiter,
  cacheMiddleware('webhooks'),
  handleGetTeamWebhooks,
);

/**
 * @swagger
 * /team-webhooks/{tournamentId}/{teamName}/{webhookId}:
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
 *         name: teamName
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
  '/:tournamentId/:teamName/:webhookId',
  defaultLimiter,
  handleDeleteWebhook,
);

export default router;
