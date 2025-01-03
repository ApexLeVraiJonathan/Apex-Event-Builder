import { body } from 'express-validator';

export const createTournamentCodeSchema = [
  body('teamSize')
    .isInt({ min: 1, max: 5 })
    .withMessage('Team size must be between 1 and 5'),

  body('spectators')
    .optional()
    .isBoolean()
    .withMessage('Spectators must be a boolean'),

  body('pickType')
    .isIn(['BLIND_PICK', 'DRAFT_MODE', 'ALL_RANDOM', 'TOURNAMENT_DRAFT'])
    .withMessage('Invalid pick type'),

  body('mapType')
    .isIn(['SUMMONERS_RIFT', 'HOWLING_ABYSS'])
    .withMessage('Invalid map type'),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),

  body('allowedSummonerIds')
    .optional()
    .isArray()
    .withMessage('Allowed summoner IDs must be an array')
    .custom((value) => {
      if (value && (!Array.isArray(value) || value.length > 10)) {
        throw new Error('Maximum 10 summoner IDs allowed');
      }
      return true;
    }),
];
