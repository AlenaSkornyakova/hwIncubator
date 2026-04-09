import { body } from 'express-validator';

export const blogInputValidation = [
  body('name').
  trim().
  notEmpty().
  isString().
  isLength({ min: 2, max: 15 }).
  withMessage('name is invalid, it must be a string with length between 2 and 15 characters'),
  body('description').
  trim().
  notEmpty().
  isString().
  isLength({min: 2, max: 500 }).
  withMessage('description is invalid, it must be a string with length between 2 and 500 characters '),
  body('websiteUrl').
  trim().
  notEmpty().
  isString().
  isLength({ min: 5, max: 100 }).
  matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).
  withMessage('websiteUrl is invalid, it must be a string with length between 5 and 100 characters and match the pattern'),
];
