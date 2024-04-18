import express from 'express';
import authControllers from '../controllers/authControllers.js';
import { userSingupSchema, userSinginSchema } from '../schemas/usersSchemas.js';
import validateBody from '../decorators/validateBody.js';

const authRouter = express.Router();

authRouter.post('/signup', validateBody(userSingupSchema), authControllers.signup);

authRouter.post('/current', authControllers.getCurrent);

authRouter.post('/signin', validateBody(userSinginSchema), authControllers.signin);

export default authRouter;
