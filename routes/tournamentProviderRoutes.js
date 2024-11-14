import express from 'express';
import { handleCreateProvider } from '../controllers/tournamentProviderController.js';

const router = express.Router();

/**
 * @swagger
 * /api/tournaments/create-provider:
 *   post:
 *     summary: Create a tournament provider
 *     description: Registers a new tournament provider with Riot Games
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 example: "NA"
 *               url:
 *                 type: string
 *                 example: "https://localhost:3000/api/tournaments/callback"
 *     responses:
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data not found
 *       405:
 *         description: Method not allowed
 *       415:
 *         description: Unsupported media type
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 *       502:
 *         description: Bad gateway
 *       503:
 *         description: Service unavailable
 *       504:
 *         description: Gateway timeout
 */
router.post('/create-provider', handleCreateProvider);

export default router;
