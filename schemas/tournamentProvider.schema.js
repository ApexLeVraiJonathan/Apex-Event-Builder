import Joi from 'joi';

export const createProviderSchema = Joi.object({
  region: Joi.string()
    .required()
    .valid('NA', 'BR', 'LAN', 'LAS', 'OCE')
    .messages({
      'any.required': 'Region is required',
      'string.empty': 'Region cannot be empty',
      'any.only': 'Region must be one of: NA, BR, LAN, LAS, OCE',
    }),
  url: Joi.string().required().uri().messages({
    'any.required': 'URL is required',
    'string.empty': 'URL cannot be empty',
    'string.uri': 'URL must be a valid URI',
  }),
});
