import Joi from 'joi';

export const addMarketSchema = Joi.object({
  marketName: Joi.string().required().max(100),
  sectorAvailable: Joi.string().valid("INVESTMENT", "LOAN", "ALL").required().max(100),
});
