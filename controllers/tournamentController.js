import { tournamentService } from '../services/tournamentService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const handleCreateTournament = async (req, res, next) => {
  try {
    const { providerId, name, ...tournamentData } = req.body;

    // First create tournament in Riot's system
    const riotTournamentId = await tournamentService.createRiotTournament(
      providerId,
      name,
    );

    // Then save in our database
    const tournament = await tournamentService.saveTournament({
      id: riotTournamentId.toString(),
      providerId: providerId.toString(),
      name,
      ...tournamentData,
    });

    return ApiResponse.success(
      res,
      tournament,
      'Tournament created successfully',
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const handleGetTournaments = async (req, res, next) => {
  try {
    const tournaments = await tournamentService.listTournaments();
    return ApiResponse.success(
      res,
      tournaments,
      'Tournaments retrieved successfully',
    );
  } catch (error) {
    next(error);
  }
};

export const handleGetTournament = async (req, res, next) => {
  try {
    const tournament = await tournamentService.getTournament(req.params.id);
    return ApiResponse.success(
      res,
      tournament,
      'Tournament retrieved successfully',
    );
  } catch (error) {
    next(error);
  }
};
