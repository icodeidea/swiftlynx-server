import Joi from 'joi';

export const addContractSchema = Joi.object({
  projectId: Joi.string().required().max(100),
  contractName: Joi.string().required().max(100),
  fixedAmount: Joi.number().min(1000),
  minAmount: Joi.number().min(1000),
  maxAmount: Joi.number(),
  type: Joi.string().valid("SWIFT_LOAN", "PEER_TO_PEER_LOAN").required().max(100),
  interest: Joi.number().required(),
  maturityTime: Joi.string().required(),
});

export const signContractSchema = Joi.object({
  contractId: Joi.string().required().max(1000),
  amount: Joi.string().required()
});
