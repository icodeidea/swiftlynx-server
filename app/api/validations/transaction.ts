import Joi from 'joi';

export const initPaymentSchema = Joi.object({
    amount: Joi.string().required(),
    entityId: Joi.string().required(),
    entity: Joi.string().required().valid(        
        'contract',
        'safe',
    ),
});