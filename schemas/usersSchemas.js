import Joi from 'joi';
import { emailRegexp, passwordRegexp } from '../constants/userConstants.js';

export const userSingupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).min(6).max(20).required(),
});

export const userSinginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).min(6).max(20).required(),
});
