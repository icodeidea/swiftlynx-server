import Joi from 'joi';

export const startProjectSchema = Joi.object({
  projectName: Joi.string().required().max(100),
  projectDescription: Joi.string().required().max(100),
  marketId: Joi.string().required().max(1000),
  projectCategory: Joi.string(),
  projectType: Joi.string().valid("STARTUP", "OFFICIAL",).required().max(100),
});
