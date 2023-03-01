import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

export const signupSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  accountType: Joi.string().valid('individual', 'organisation').required(),
  email: Joi.string().email().required(),
  password: passwordComplexity(),
  username: Joi.string().required(),
  dob: Joi.date(),
  gender: Joi.string(),
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
  newPassword: Joi.string().required(),
  password: Joi.string().required(),
  logOtherDevicesOut: Joi.boolean()
});

export const userUpdateSchema = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
  dob: Joi.date(),
  gender: Joi.string(),
  country: Joi.string(),
});


export const onlyEmailSchema = Joi.object({
  email: Joi.string().required(),
});
