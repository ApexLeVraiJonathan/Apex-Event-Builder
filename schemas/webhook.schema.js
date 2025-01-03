import Joi from 'joi';

export const registerWebhookSchema = Joi.object({
  teamName: Joi.string().required().min(2).max(30).messages({
    'any.required': 'Team name is required',
    'string.empty': 'Team name cannot be empty',
    'string.min': 'Team name must be at least 2 characters long',
    'string.max': 'Team name cannot exceed 30 characters',
  }),

  webhookUrl: Joi.string()
    .required()
    .pattern(
      new RegExp('^https://discord.com/api/webhooks/[0-9]+/[A-Za-z0-9_-]+$'),
    )
    .messages({
      'any.required': 'Webhook URL is required',
      'string.empty': 'Webhook URL cannot be empty',
      'string.pattern.base':
        'Must be a valid Discord webhook URL (https://discord.com/api/webhooks/[ID]/[TOKEN])',
    }),
}).required();
