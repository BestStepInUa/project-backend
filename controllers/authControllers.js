import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import * as authServices from '../services/authServices.js';
import HttpError from '../helpers/HttpError.js';
import sendMail from '../helpers/sendEmail.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const { JWT_SECRET, PROJECT_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, `Email ${email} already in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationCode = nanoid();
  const newUser = await authServices.singup({ ...req.body, password: hashPassword, verificationCode });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target='_blank' href='${PROJECT_URL}/api/auth/verify/${verificationCode}'>Verify your email</a>`,
  };

  await sendMail(verifyEmail);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const verify = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await authServices.findUser({ verificationCode });
  if (!user) {
    throw HttpError(404, 'Email not found or already verified');
  }

  await authServices.updateUser({ _id: user._id }, { verify: true, verificationCode: '' });

  res.json({
    message: 'Email verified success',
  });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, 'Email not found');
  }
  if (user.verify) {
    throw HttpError(400, 'Email already verified');
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target='_blank' href='${PROJECT_URL}/api/auth/verify/${user.verificationCode}'>Verify your email</a>`,
  };

  await sendMail(verifyEmail);

  res.json({
    message: 'Verify email send again',
  });
};

const singin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, 'Email or password invalide');
  }
  if (!user.verify) {
    throw HttpError(401, 'Email not verify');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password invalide');
  }

  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user;

  res.json({
    username,
    email,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: '' });

  res.json({
    message: 'Signout success',
  });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  signin: ctrlWrapper(singin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
};
