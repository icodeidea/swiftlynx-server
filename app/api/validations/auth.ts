import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  referer: Joi.string(),
});

export const OAuthSchema = Joi.object({
  token: Joi.string().required(),
  refCode: Joi.string(),
});

export const signinSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string(),
});

export const updatePasswordSchema = Joi.object({
  password: Joi.string().required(),
});

export const authedUpdatePasswordSchema = Joi.object({
  current: Joi.string().required(),
  password: Joi.string().required(),
});

export const userUpdateSchema = Joi.object({
  username: Joi.string(),
  dateOfBirth: Joi.date(),
  country: Joi.string(),
  region: Joi.string(),
});


export const onlyEmailSchema = Joi.object({
  email: Joi.string().required(),
});
