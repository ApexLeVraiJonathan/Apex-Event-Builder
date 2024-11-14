import express from 'express';
import { handleCreateTournament } from '../controllers/tournamentController.js';

const router = express.Router();

/**
 * @swagger
 * /api/tournaments/create-tournament:
 *   post:
 *     summary: Create a new tournament
 *     description: Creates a new tournament associated with a tournament provider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               providerId:
 *                 type: number
 *                 description: ID of the tournament provider
 *                 example: 14038
 *               name:
 *                 type: string
 *                 description: Name of the tournament
 *                 example: "My League Tournament"
 *     responses:
 *       201:
 *         description: Tournament created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tournamentId:
 *                   type: string
 *                   description: The ID of the created tournament
 *                   example: "123456"
 *       400:
 *         description: Bad request - missing providerId or name
 *       500:
 *         description: Internal server error
 */
router.post('/create-tournament', handleCreateTournament);

export default router;
