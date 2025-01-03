import Joi from 'joi';

export const createTeamWebhookSchema = Joi.object({
  tournamentId: Joi.number().required().positive().messages({
    'any.required': 'Tournament ID is required',
    'number.base': 'Tournament ID must be a number',
    'number.positive': 'Tournament ID must be positive',
  }),
  tournamentName: Joi.string().required().min(3).max(60).messages({
    'any.required': 'Tournament name is required',
    'string.empty': 'Tournament name cannot be empty',
    'string.min': 'Tournament name must be at least 3 characters long',
    'string.max': 'Tournament name cannot exceed 60 characters',
  }),
  teamName: Joi.string().required().min(2).max(30).messages({
    'any.required': 'Team name is required',
    'string.empty': 'Team name cannot be empty',
    'string.min': 'Team name must be at least 2 characters long',
    'string.max': 'Team name cannot exceed 30 characters',
  }),
  webhookUrl: Joi.string()
    .required()
    .uri()
    .pattern(/^https:\/\/discord\.com\/api\/webhooks\//)
    .messages({
      'any.required': 'Webhook URL is required',
      'string.empty': 'Webhook URL cannot be empty',
      'string.uri': 'Webhook URL must be a valid URI',
      'string.pattern.base': 'Webhook URL must be a valid Discord webhook URL',
    }),
});
