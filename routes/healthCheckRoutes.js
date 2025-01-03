import express from 'express';
import { ApiResponse } from '../utils/apiResponse.js';
import { client as cosmosClient } from '../config/cosmos.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
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
 *                     status:
 *                       type: string
 *                       example: OK
 */
router.get('/', async (req, res) => {
  return ApiResponse.success(res, { status: 'OK' }, 'Service is healthy');
});

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health status
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
 *                     status:
 *                       type: string
 *                       example: OK
 *                     database:
 *                       type: string
 *                       example: Connected
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       503:
 *         description: Service partially degraded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: string
 *                       example: Disconnected
 */
router.get('/detailed', async (req, res) => {
  try {
    await cosmosClient.getDatabaseAccount();

    return ApiResponse.success(
      res,
      {
        status: 'OK',
        database: 'Connected',
        timestamp: new Date().toISOString(),
      },
      'All systems operational',
    );
  } catch (error) {
    logger.error('Health check failed:', error);
    return ApiResponse.error(res, 'Service partially degraded', 503, {
      database: 'Disconnected',
    });
  }
});

export default router;
