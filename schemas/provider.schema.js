import Joi from 'joi';

export const createProviderSchema = Joi.object({
  region: Joi.string()
    .valid(
      'BR',
      'EUNE',
      'EUW',
      'JP',
      'LAN',
      'LAS',
      'NA',
      'OCE',
      'PBE',
      'RU',
      'TR',
      'KR',
      'PH',
      'SG',
      'TH',
      'TW',
      'VN',
    )
    .required(),
  url: Joi.string()
    .uri()
    .required()
    .pattern(/^https?:\/\/.+/)
    .message('URL must use http or https protocol'),
}).required();

export const updateProviderSchema = Joi.object({
  region: Joi.string().valid(
    'BR',
    'EUNE',
    'EUW',
    'JP',
    'LAN',
    'LAS',
    'NA',
    'OCE',
    'PBE',
    'RU',
    'TR',
    'KR',
    'PH',
    'SG',
    'TH',
    'TW',
    'VN',
  ),
  url: Joi.string()
    .uri()
    .pattern(/^https?:\/\/.+/)
    .message('URL must use http or https protocol'),
})
  .min(1)
  .required();
