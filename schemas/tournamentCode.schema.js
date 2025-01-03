import Joi from 'joi';

export const createTournamentCodeSchema = Joi.object({
  teamSize: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Team size must be a number',
    'number.integer': 'Team size must be an integer',
    'number.min': 'Team size must be at least 1',
    'number.max': 'Team size must be at most 5',
    'any.required': 'Team size is required',
  }),

  spectatorType: Joi.string()
    .valid('ALL', 'NONE', 'LOBBYONLY')
    .required()
    .messages({
      'string.base': 'Spectator type must be a string',
      'any.only': 'Invalid spectator type. Must be ALL, NONE, or LOBBYONLY',
      'any.required': 'Spectator type is required',
    }),

  pickType: Joi.string()
    .valid('BLIND_PICK', 'DRAFT_MODE', 'ALL_RANDOM', 'TOURNAMENT_DRAFT')
    .required()
    .messages({
      'string.base': 'Pick type must be a string',
      'any.only':
        'Invalid pick type. Must be BLIND_PICK, DRAFT_MODE, ALL_RANDOM, or TOURNAMENT_DRAFT',
      'any.required': 'Pick type is required',
    }),

  mapType: Joi.string()
    .valid('SUMMONERS_RIFT', 'HOWLING_ABYSS')
    .required()
    .messages({
      'string.base': 'Map type must be a string',
      'any.only': 'Invalid map type. Must be SUMMONERS_RIFT or HOWLING_ABYSS',
      'any.required': 'Map type is required',
    }),

  metadata: Joi.alternatives()
    .try(Joi.string(), Joi.object())
    .optional()
    .default({}),

  teams: Joi.array().items(Joi.string()).min(2).max(2).optional().messages({
    'array.base': 'Teams must be an array',
    'array.min': 'Must provide exactly 2 teams',
    'array.max': 'Must provide exactly 2 teams',
    'string.base': 'Team names must be strings',
  }),
}).required();
