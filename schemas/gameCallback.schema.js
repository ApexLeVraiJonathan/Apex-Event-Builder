import Joi from 'joi';

export const gameCallbackSchema = Joi.object({
  startTime: Joi.number().required(),
  shortCode: Joi.string().required(),
  metaData: Joi.string().allow('').optional(),
  gameId: Joi.number().required(),
  gameName: Joi.string().required(),
  gameType: Joi.string().required(),
  gameMap: Joi.number().required(),
  gameMode: Joi.string().required(),
  region: Joi.string().required(),
}).required();
