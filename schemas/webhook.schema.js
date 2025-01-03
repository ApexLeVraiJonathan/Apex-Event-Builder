import { body } from 'express-validator';

export const registerWebhookSchema = [
  body('webhookUrl')
    .trim()
    .notEmpty()
    .withMessage('Webhook URL is required')
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true,
    })
    .withMessage('Must be a valid HTTP/HTTPS URL'),

  body('secret')
    .optional()
    .isString()
    .isLength({ min: 16, max: 64 })
    .withMessage('Secret must be between 16 and 64 characters'),

  body('events')
    .optional()
    .isArray()
    .withMessage('Events must be an array')
    .custom((value) => {
      const validEvents = [
        'game.created',
        'game.started',
        'game.completed',
        'team.joined',
        'team.left',
      ];

      if (!value.every((event) => validEvents.includes(event))) {
        throw new Error('Contains invalid event types');
      }
      return true;
    }),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
];
