import { body } from 'express-validator';

export const userCreateInputValidation = [
  body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),
  body("login")
    .isString()
    .withMessage('Login must be a string')
    .trim()
    .isLength({min: 3, max: 10})
    .withMessage("Login must be between 3 and 10 characters")
]