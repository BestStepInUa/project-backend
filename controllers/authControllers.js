import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authServices from '../services/authServices.js';
import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (user) {
    throw HttpError(409, `Email ${email} already in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await authServices.singup({ ...req.body, password: hashPassword });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const singin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(401, 'Email or password invalide');
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
  res.json({
    token,
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(singin),
};