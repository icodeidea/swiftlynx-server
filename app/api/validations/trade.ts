import Joi from 'joi';

export const startTradeSchema = Joi.object({
    amount: Joi.string().required(),
    month: Joi.number().valid(6, 12).required(),
});

export const updateTradeSchema = Joi.object({
    tradeId: Joi.string().required(),
    state: Joi.string().required(),
});