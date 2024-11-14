import express from 'express';
import { handleGameCompletionCallback } from '../controllers/gameCompletionController.js';

const router = express.Router();

/**
 * @swagger
 * /api/tournaments/callback:
 *   post:
 *     summary: Handle game completion callback
 *     description: Receives game completion data from the Riot Games servers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: integer
 *                 example: 1234567890000
 *               shortCode:
 *                 type: string
 *                 example: "NA1234a-1a23b456-a1b2-1abc-ab12-1234567890ab"
 *               metaData:
 *                 type: string
 *                 example: "{\"title\":\"Game 42 - Finals\"}"
 *               gameId:
 *                 type: integer
 *                 example: 1234567890
 *               gameName:
 *                 type: string
 *                 example: "a123bc45-ab1c-1a23-ab12-12345a67b89c"
 *               gameType:
 *                 type: string
 *                 example: "Practice"
 *               gameMap:
 *                 type: integer
 *                 example: 11
 *               gameMode:
 *                 type: string
 *                 example: "CLASSIC"
 *               region:
 *                 type: string
 *                 example: "NA1"
 *     responses:
 *       200:
 *         description: Game completion received successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/callback', handleGameCompletionCallback);

export default router;
