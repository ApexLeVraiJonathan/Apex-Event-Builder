import { tournamentCodeService } from '../services/tournamentCodeService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export const handleCreateTournamentCode = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId } = req.params;
  const { count = 1, ...codeData } = req.sanitizedBody;

  try {
    logger.info({
      correlationId,
      message: `Creating ${count} tournament codes`,
      tournamentId,
      data: codeData,
    });

    const codes = await tournamentCodeService.createCodes(
      tournamentId,
      codeData,
      count,
    );

    logger.info({
      correlationId,
      message: 'Tournament codes created successfully',
      count: codes.length,
    });

    return ApiResponse.success(
      res,
      codes,
      'Tournament codes created successfully',
      201,
    );
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to create tournament codes',
      error: error.message,
    });
    next(error);
  }
};

export const handleGetTournamentCodes = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId } = req.params;

  try {
    logger.info({
      correlationId,
      message: 'Fetching tournament codes',
      tournamentId,
    });

    const codes = await tournamentCodeService.getCodes(tournamentId, req.query);

    logger.info({
      correlationId,
      message: 'Tournament codes fetched successfully',
      count: codes.length,
    });

    return ApiResponse.success(
      res,
      codes,
      'Tournament codes retrieved successfully',
    );
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to fetch tournament codes',
      error: error.message,
    });
    next(error);
  }
};

export const handleInvalidateCode = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId, codeId } = req.params;

  try {
    logger.info({
      correlationId,
      message: 'Invalidating tournament code',
      tournamentId,
      codeId,
    });

    const code = await tournamentCodeService.invalidateCode(
      tournamentId,
      codeId,
    );

    logger.info({
      correlationId,
      message: 'Tournament code invalidated successfully',
      codeId,
    });

    return ApiResponse.success(
      res,
      code,
      'Tournament code invalidated successfully',
    );
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to invalidate tournament code',
      error: error.message,
    });
    next(error);
  }
};
