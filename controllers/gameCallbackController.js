import logger from '../utils/logger.js';
import { gameCallbackService } from '../services/gameCallbackService.js';
import { gameResultService } from '../services/gameResultService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const handleGameCallback = async (req, res, next) => {
  const { correlationId } = req;

  try {
    logger.info({
      correlationId,
      message: 'Processing game callback',
      data: req.sanitizedBody,
    });

    const gameCallback = await gameCallbackService.processCallback(
      req.sanitizedBody,
    );

    logger.info({
      correlationId,
      message: 'Game callback processed successfully',
      gameId: gameCallback.gameId,
    });

    return ApiResponse.success(res, { gameCallback });
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to process game callback',
      error: error.message,
    });
    next(error);
  }
};

export const handleGetCallbacks = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId } = req.params;

  try {
    logger.info({
      correlationId,
      message: 'Fetching game callbacks',
      tournamentId,
    });

    const callbacks = await gameCallbackService.getCallbacks(tournamentId);

    logger.info({
      correlationId,
      message: 'Game callbacks fetched successfully',
      count: callbacks.length,
    });

    return ApiResponse.success(res, { callbacks });
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to fetch game callbacks',
      error: error.message,
    });
    next(error);
  }
};

export const handleGetCallback = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId, callbackId } = req.params;

  try {
    logger.info({
      correlationId,
      message: 'Fetching game callback',
      tournamentId,
      callbackId,
    });

    const callback = await gameCallbackService.getCallback(
      tournamentId,
      callbackId,
    );

    logger.info({
      correlationId,
      message: 'Game callback fetched successfully',
      callbackId,
    });

    return ApiResponse.success(res, { callback });
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to fetch game callback',
      error: error.message,
    });
    next(error);
  }
};

export const handleGetGameResult = async (req, res, next) => {
  const { correlationId } = req;
  const { gameId } = req.params;

  try {
    logger.info({
      correlationId,
      message: 'Fetching game result',
      gameId,
    });

    const result = await gameResultService.getGameResult(gameId);

    logger.info({
      correlationId,
      message: 'Game result fetched successfully',
      gameId,
    });

    return ApiResponse.success(res, { result });
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to fetch game result',
      error: error.message,
    });
    next(error);
  }
};
