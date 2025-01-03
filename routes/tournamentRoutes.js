import express from 'express';
import {
  handleCreateTournament,
  handleGetTournaments,
  handleGetTournament,
} from '../controllers/tournamentController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { tournamentSchema } from '../schemas/tournament.schema.js';
import { defaultLimiter } from '../middlewares/rateLimiter.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

/**
 * @swagger
 * /tournaments:
 *   post:
 *     summary: Create a new tournament
 *     tags: [Tournaments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             title: TournamentRegistrationParametersV5
 *             required:
 *               - providerId
 *             properties:
 *               providerId:
 *                 type: integer
 *                 description: The provider ID to specify the regional registered provider data to associate this tournament
 *                 example: 123456
 *               name:
 *                 type: string
 *                 description: The optional name of the tournament
 *                 example: "Summer Championship"
 *     responses:
 *       200:
 *         description: Tournament created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: integer
 *                   description: The tournament ID
 *                   example: 123456
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
router.post(
  '/',
  defaultLimiter,
  validateRequest(tournamentSchema),
  handleCreateTournament,
);

/**
 * @swagger
 * /tournaments:
 *   get:
 *     summary: Get all tournaments
 *     tags: [Tournaments]
 *     parameters:
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *         description: Filter by provider ID
 *     responses:
 *       200:
 *         description: List of tournaments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tournament'
 */
router.get(
  '/',
  defaultLimiter,
  cacheMiddleware('tournaments'),
  handleGetTournaments,
);

/**
 * @swagger
 * /tournaments/{id}:
 *   get:
 *     summary: Get tournament by ID
 *     tags: [Tournaments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tournament details
 *       404:
 *         $ref: '#/components/responses/Error'
 */
router.get(
  '/:id',
  defaultLimiter,
  cacheMiddleware('tournament'),
  handleGetTournament,
);

export default router;
