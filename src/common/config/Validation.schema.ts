import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().uri().required(),
  PARTNER_API_KEY: Joi.string().allow('').optional(),
});