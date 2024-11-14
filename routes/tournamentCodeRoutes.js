import express from 'express';
import { handleCreateTournamentCodes } from '../controllers/tournamentCodeController.js';

const router = express.Router();

/**
 * @swagger
 * /api/tournaments/create-codes:
 *   post:
 *     summary: Generate tournament codes
 *     description: Creates tournament codes for a specific tournament
 *     parameters:
 *       - in: query
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: number
 *         description: The ID of the tournament
 *       - in: query
 *         name: count
 *         required: true
 *         schema:
 *           type: number
 *         description: The number of codes to generate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enoughPlayers:
 *                 type: boolean
 *                 example: false
 *               mapType:
 *                 type: string
 *                 example: "SUMMONERS_RIFT"
 *               metadata:
 *                 type: string
 *                 example: "My Tournament Code"
 *               pickType:
 *                 type: string
 *                 example: "TOURNAMENT_DRAFT"
 *               spectatorType:
 *                 type: string
 *                 example: "ALL"
 *               teamSize:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Tournament codes created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/create-codes', handleCreateTournamentCodes);

export default router;
