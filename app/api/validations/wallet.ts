import Joi from 'joi';

export const activation = Joi.object({
    address: Joi.string().required(),
});

export const withdrawalSchema = Joi.object({
    address: Joi.string().required(),
    amount: Joi.number().required(),
});

export const requestPayoutSchema = Joi.object({
    entity: Joi.string().valid('safe', 'Trade').required(),
    entityId: Joi.string().required(),
    accountDetailId: Joi.string().required(),
});

export const addAccountDetailSchema = Joi.object({
    accountName: Joi.string().required(), 
    accountNumber: Joi.string().required(),
    bankname: Joi.string().required(),
});

export const deleteAccountDetailSchema = Joi.object({
    accountDetailId: Joi.string().required(),
});