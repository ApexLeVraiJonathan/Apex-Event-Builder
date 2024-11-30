import express from 'express';
import { addTeamWebhook } from '../controllers/teamWebhookController.js';

const router = express.Router();

/**
 * @swagger
 * /api/teams/webhook:
 *   post:
 *     summary: Add a team webhook
 *     description: Add a webhook URL for a team in a specific tournament
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tournamentId:
 *                 type: string
 *                 example: "123456"
 *               tournamentName:
 *                 type: string
 *                 example: "Spring Invitational"
 *               teamName:
 *                 type: string
 *                 example: "Team A"
 *               webhookUrl:
 *                 type: string
 *                 example: "https://discord.com/api/webhooks/..."
 *     responses:
 *       201:
 *         description: Webhook added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/webhook', addTeamWebhook);

export default router;
