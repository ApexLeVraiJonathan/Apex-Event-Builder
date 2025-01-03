import { body } from 'express-validator';

export const gameCompletionSchema = [
  body('gameId').trim().notEmpty().withMessage('Game ID is required'),

  body('winningTeam')
    .isArray()
    .withMessage('Winning team must be an array')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Winning team cannot be empty');
      }
      return true;
    }),

  body('losingTeam')
    .isArray()
    .withMessage('Losing team must be an array')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Losing team cannot be empty');
      }
      return true;
    }),

  body('gameDuration')
    .isInt({ min: 0 })
    .withMessage('Game duration must be a positive number'),

  body('gameStartTime')
    .isISO8601()
    .withMessage('Game start time must be a valid ISO 8601 date'),

  body('gameEndTime')
    .isISO8601()
    .withMessage('Game end time must be a valid ISO 8601 date')
    .custom((endTime, { req }) => {
      if (endTime <= req.body.gameStartTime) {
        throw new Error('Game end time must be after start time');
      }
      return true;
    }),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
];

export const gameCallbackSchema = [
  body('startTime').isInt().withMessage('Start time must be a valid timestamp'),
  body('shortCode').isString().withMessage('Short code is required'),
  body('metaData').isString().withMessage('Meta data must be a string'),
  body('gameId').isInt().withMessage('Game ID must be a valid number'),
  body('gameName').isString().withMessage('Game name is required'),
  body('gameType').isString().withMessage('Game type is required'),
  body('gameMap').isInt().withMessage('Game map must be a valid number'),
  body('gameMode').isString().withMessage('Game mode is required'),
  body('region').isString().withMessage('Region is required'),
];
