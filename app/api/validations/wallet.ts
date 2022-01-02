import Joi from 'joi';

export const activation = Joi.object({
    address: Joi.string().required(),
});

export const withdrawalSchema = Joi.object({
    address: Joi.string().required(),
    amount: Joi.number().required(),
});