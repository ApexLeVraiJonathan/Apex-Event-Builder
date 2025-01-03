import { tournamentCodeService } from '../services/tournamentCodeService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export const handleCreateTournamentCode = async (req, res, next) => {
  const { correlationId } = req;
  const { tournamentId } = req.params;
  const count = parseInt(req.query.count || '1', 10);
  const codeData = req.body;

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
      { codes },
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

export const handleGetTournamentCode = async (req, res, next) => {
  const { correlationId } = req;
  const { code } = req.params;

  try {
    logger.info({
      correlationId,
      message: 'Fetching tournament code',
      code,
    });

    const tournamentCode = await tournamentCodeService.getCode(code);

    if (!tournamentCode) {
      return ApiResponse.error(res, 'Tournament code not found', 404);
    }

    logger.info({
      correlationId,
      message: 'Tournament code fetched successfully',
      code,
    });

    return ApiResponse.success(
      res,
      tournamentCode,
      'Tournament code retrieved successfully',
    );
  } catch (error) {
    logger.error({
      correlationId,
      message: 'Failed to fetch tournament code',
      error: error.message,
    });
    next(error);
  }
};
