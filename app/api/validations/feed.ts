import Joi from 'joi';

export const createFeedSchema = Joi.object({
  title: Joi.string().required().max(100),
  content: Joi.string().required(),
  shortContent: Joi.string().required(),
  tags: Joi.array().required(),
  image: Joi.string().required(),
  reward: Joi.number().required().max(100),
  published: Joi.boolean(),
});
