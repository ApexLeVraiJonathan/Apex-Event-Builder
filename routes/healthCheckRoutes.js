import express from 'express';
import { healthCheckService } from '../services/healthCheckService.js';
import { ApiResponse } from '../utils/apiResponse.js';

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
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: OK
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T00:00:00.000Z
 */
router.get('/', async (req, res) => {
  const status = await healthCheckService.getBasicStatus();
  return ApiResponse.success(res, status, 'Service is healthy');
});

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check including database status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: All systems operational
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
 *                   example: All systems operational
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       enum: [healthy, degraded]
 *                       example: healthy
 *                     database:
 *                       type: string
 *                       enum: [connected, disconnected]
 *                       example: connected
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-01T00:00:00.000Z
 *                     responseTime:
 *                       type: number
 *                       description: Response time in milliseconds
 *                       example: 42
 *       503:
 *         $ref: '#/components/responses/ServiceUnavailable'
 */
router.get('/detailed', async (req, res) => {
  const status = await healthCheckService.getDetailedStatus();

  if (status.status === 'degraded') {
    return ApiResponse.error(res, 'Service partially degraded', 503, status);
  }

  return ApiResponse.success(res, status, 'All systems operational');
});

export default router;
