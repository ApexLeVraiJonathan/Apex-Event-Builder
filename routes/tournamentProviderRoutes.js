import express from 'express';
import {
  handleCreateProvider,
  handleGetProvider,
  handleListProviders,
} from '../controllers/tournamentProviderController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createProviderSchema } from '../schemas/provider.schema.js';
import { defaultLimiter } from '../middlewares/rateLimiter.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

/**
 * @swagger
 * /tournament-providers:
 *   get:
 *     summary: Get all tournament providers
 *     tags: [Tournament Providers]
 *     responses:
 *       200:
 *         description: List of tournament providers
 */
router.get(
  '/',
  defaultLimiter,
  cacheMiddleware('providers'),
  handleListProviders,
);

/**
 * @swagger
 * /tournament-providers/{id}:
 *   get:
 *     summary: Get a specific tournament provider
 *     tags: [Tournament Providers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tournament provider ID
 *     responses:
 *       200:
 *         description: Tournament provider retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tournament provider retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "1234567"
 *                     region:
 *                       type: string
 *                       example: "NA"
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: "https://api.example.com/tournament-callbacks"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     type:
 *                       type: string
 *                       example: "provider"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tournament provider not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  defaultLimiter,
  cacheMiddleware('provider'),
  handleGetProvider,
);

/**
 * @swagger
 * /tournament-providers:
 *   post:
 *     summary: Register a tournament provider with Riot's tournament system
 *     description: Providers must call this endpoint first to register their callback URL and API key with the tournament system before any other tournament provider endpoints will work.
 *     tags: [Tournament Providers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             title: ProviderRegistrationParametersV5
 *             required:
 *               - region
 *               - url
 *             properties:
 *               region:
 *                 type: string
 *                 description: The region in which the provider will be running tournaments
 *                 enum: [BR, EUNE, EUW, JP, LAN, LAS, NA, OCE, PBE, RU, TR, KR, PH, SG, TH, TW, VN]
 *                 example: "NA"
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: The provider's callback URL for tournament game results. Must use http (port 80) or https (port 443).
 *                 example: "https://api.example.com/tournament-callbacks"
 *     responses:
 *       201:
 *         description: Provider registered successfully
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
 *                   description: The provider ID assigned by Riot
 *                   example: 1234567
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
router.post('/', validateRequest(createProviderSchema), handleCreateProvider);

export default router;
