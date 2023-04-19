import Joi from 'joi';

export const createSafeSchema = Joi.object({
    remark: Joi.string().required(),
    goal: Joi.string().required(),
});