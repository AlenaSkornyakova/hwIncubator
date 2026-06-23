import { body } from 'express-validator';

export const authInputValidation = [
  body('loginOrEmail')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('loginOrEmail is not correct'),

  body('password')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),
];
