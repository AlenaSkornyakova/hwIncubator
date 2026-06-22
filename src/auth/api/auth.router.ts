import { Router } from 'express';
import { authInputValidation } from './middlewares/auth-input-validation.middleware';
import { loginHandler } from './handlers/login.handler';
import { inputValidationResultMiddleware } from '../../core/middlewares/input-validation-result.middleware';

export const authRouter = Router();

authRouter.post(
  '/login',
  authInputValidation,
  inputValidationResultMiddleware,
  loginHandler
);
