import Joi from 'joi';

export const createSafeSchema = Joi.object({
    remark: Joi.string().required(),
    goal: Joi.string().required(),
});

export const updateSafeSchema = Joi.object({
    safeId: Joi.string().required(),
    state: Joi.string().required(),
});