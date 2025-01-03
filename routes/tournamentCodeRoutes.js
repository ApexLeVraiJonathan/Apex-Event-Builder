import express from 'express';
import {
  handleCreateTournamentCode,
  handleGetTournamentCodes,
  handleGetTournamentCode,
} from '../controllers/tournamentCodeController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createTournamentCodeSchema } from '../schemas/tournamentCode.schema.js';
import { defaultLimiter } from '../middlewares/rateLimiter.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

/**
 * @swagger
 * /tournament-codes/{tournamentId}/codes:
 *   post:
 *     summary: Generate tournament codes
 *     tags: [Tournament Codes]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The tournament ID
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 1
 *         description: The number of codes to create (max 1000)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamSize
 *               - spectatorType
 *               - pickType
 *               - mapType
 *             properties:
 *               teamSize:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 5
 *               spectatorType:
 *                 type: string
 *                 enum: [ALL, NONE, LOBBYONLY]
 *                 default: ALL
 *               pickType:
 *                 type: string
 *                 enum: [BLIND_PICK, DRAFT_MODE, ALL_RANDOM, TOURNAMENT_DRAFT]
 *                 default: TOURNAMENT_DRAFT
 *               mapType:
 *                 type: string
 *                 enum: [SUMMONERS_RIFT, HOWLING_ABYSS]
 *                 default: SUMMONERS_RIFT
 *               metadata:
 *                 type: object
 *                 default: {}
 *               teams:
 *                 type: array
 *                 minItems: 2
 *                 maxItems: 2
 *                 items:
 *                   type: string
 *                 description: Array of team names that will participate
 *                 example: ["team1", "team2"]
 *     responses:
 *       201:
 *         description: Tournament codes created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     codes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TournamentCode'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/:tournamentId/codes',
  defaultLimiter,
  validateRequest(createTournamentCodeSchema),
  handleCreateTournamentCode,
);

/**
 * @swagger
 * /tournament-codes/{tournamentId}/codes:
 *   get:
 *     summary: Get all tournament codes
 *     tags: [Tournament Codes]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tournament
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, used]
 *         description: Filter codes by status
 *     responses:
 *       200:
 *         description: List of tournament codes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TournamentCode'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/:tournamentId/codes',
  defaultLimiter,
  cacheMiddleware('codes'),
  handleGetTournamentCodes,
);

/**
 * @swagger
 * /tournament-codes/code/{code}:
 *   get:
 *     summary: Get a specific tournament code by its value
 *     tags: [Tournament Codes]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The tournament code value
 *     responses:
 *       200:
 *         description: Tournament code details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TournamentCodeResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
  '/code/:code',
  defaultLimiter,
  cacheMiddleware('code'),
  handleGetTournamentCode,
);

export default router;
