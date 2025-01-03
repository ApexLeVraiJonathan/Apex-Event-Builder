import { tournamentProviderService } from '../services/tournamentProviderService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const handleCreateProvider = async (req, res, next) => {
  try {
    const provider = await tournamentProviderService.createProvider(req.body);
    return ApiResponse.success(
      res,
      provider,
      'Tournament provider created successfully',
      201,
    );
  } catch (error) {
    if (error.status === 409) {
      // Handle duplicate provider case
      return ApiResponse.error(res, error.message, 409);
    }
    // Handle other errors through the error middleware
    next(error);
  }
};

export const handleGetProvider = async (req, res, next) => {
  try {
    const provider = await tournamentProviderService.getProvider(req.params.id);
    return ApiResponse.success(
      res,
      provider,
      'Tournament provider retrieved successfully',
    );
  } catch (error) {
    if (error.status === 404) {
      return ApiResponse.error(res, 'Tournament provider not found', 404);
    }
    next(error);
  }
};

export const handleListProviders = async (req, res, next) => {
  try {
    const providers = await tournamentProviderService.listProviders(req.query);
    return ApiResponse.success(
      res,
      providers,
      'Tournament providers retrieved successfully',
    );
  } catch (error) {
    next(error);
  }
};
