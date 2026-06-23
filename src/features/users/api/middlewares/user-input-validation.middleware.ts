import { body } from 'express-validator';

export const userCreateInputValidation = [
  body('email')
    .exists()
    .withMessage('login is required')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),
  body('login')
    .exists()
    .withMessage('Login is required')
    .isString()
    .withMessage('Login must be a string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Login must be between 3 and 10 characters'),
];
