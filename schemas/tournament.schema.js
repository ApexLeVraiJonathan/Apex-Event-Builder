import Joi from 'joi';

export const tournamentSchema = Joi.object({
  providerId: Joi.number()
    .integer()
    .required()
    .description('The provider ID to associate this tournament with'),

  name: Joi.string()
    .allow('')
    .optional()
    .description('Optional name of the tournament'),
});
