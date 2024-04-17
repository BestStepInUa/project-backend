import User from '../models/User.js';

export const findUser = filter => User.findOne(filter);

export const singup = data => User.create(data);
