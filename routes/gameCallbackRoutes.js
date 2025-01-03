import express from 'express';
import {
  handleGameCallback,
  handleGetCallbacks,
  handleGetCallback,
  handleGetGameResult,
} from '../controllers/gameCallbackController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { gameCallbackSchema } from '../schemas/gameCallback.schema.js';
import { defaultLimiter } from '../middlewares/rateLimiter.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

/**
 * @swagger
 * /tournaments/callback:
 *   post:
 *     summary: Handle game completion callback from Riot API
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: integer
 *               shortCode:
 *                 type: string
 *               metaData:
 *                 type: string
 *               gameId:
 *                 type: integer
 *               gameName:
 *                 type: string
 *               gameType:
 *                 type: string
 *               gameMap:
 *                 type: integer
 *               gameMode:
 *                 type: string
 *               region:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game callback processed successfully
 */
router.post(
  '/callback',
  validateRequest(gameCallbackSchema),
  handleGameCallback,
);

/**
 * @swagger
 * /tournaments/{tournamentId}/games:
 *   get:
 *     summary: Get all game callbacks for a tournament
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of game callbacks
 */
router.get(
  '/:tournamentId/games',
  defaultLimiter,
  cacheMiddleware('games'),
  handleGetCallbacks,
);

/**
 * @swagger
 * /tournaments/{tournamentId}/games/{callbackId}:
 *   get:
 *     summary: Get specific game callback
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: callbackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game callback details
 */
router.get(
  '/:tournamentId/games/:callbackId',
  defaultLimiter,
  cacheMiddleware('game'),
  handleGetCallback,
);

/**
 * @swagger
 * /games/{gameId}/result:
 *   get:
 *     summary: Get detailed game result
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed game result from Riot API
 */
router.get(
  '/games/:gameId/result',
  defaultLimiter,
  cacheMiddleware('gameResult'),
  handleGetGameResult,
);

export default router;
