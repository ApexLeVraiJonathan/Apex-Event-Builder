import express from 'express';
import {
  handleCreateTournamentCode,
  handleGetTournamentCodes,
  handleInvalidateCode,
} from '../controllers/tournamentCodeController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createTournamentCodeSchema } from '../schemas/tournamentCode.schema.js';
import { defaultLimiter } from '../middlewares/rateLimiter.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

/**
 * @swagger
 * /tournaments/{tournamentId}/codes:
 *   post:
 *     summary: Create a new tournament code
 *     tags: [Tournament Codes]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tournament
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamSize
 *               - mapType
 *               - metadata
 *             properties:
 *               teamSize:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               mapType:
 *                 type: string
 *                 example: "SUMMONERS_RIFT"
 *               metadata:
 *                 type: string
 *                 description: Additional data for the tournament code
 *               allowedSummonerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of summoner IDs allowed to use this code
 *     responses:
 *       201:
 *         description: Tournament code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     id:
 *                       type: string
 *       400:
 *         $ref: '#/components/responses/Error'
 */
router.post(
  '/:tournamentId/codes',
  defaultLimiter,
  validateRequest(createTournamentCodeSchema),
  handleCreateTournamentCode,
);

/**
 * @swagger
 * /tournaments/{tournamentId}/codes:
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
 *           enum: [active, used, invalid]
 *         description: Filter codes by status
 *     responses:
 *       200:
 *         description: List of tournament codes
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       code:
 *                         type: string
 *                       status:
 *                         type: string
 *                       teamSize:
 *                         type: integer
 *                       mapType:
 *                         type: string
 *                       metadata:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.get(
  '/:tournamentId/codes',
  defaultLimiter,
  cacheMiddleware('codes'),
  handleGetTournamentCodes,
);

/**
 * @swagger
 * /tournaments/{tournamentId}/codes/{codeId}/invalidate:
 *   put:
 *     summary: Invalidate a tournament code
 *     tags: [Tournament Codes]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tournament
 *       - in: path
 *         name: codeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tournament code
 *     responses:
 *       200:
 *         description: Tournament code invalidated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *       404:
 *         $ref: '#/components/responses/Error'
 */
router.put(
  '/:tournamentId/codes/:codeId/invalidate',
  defaultLimiter,
  handleInvalidateCode,
);

export default router;
