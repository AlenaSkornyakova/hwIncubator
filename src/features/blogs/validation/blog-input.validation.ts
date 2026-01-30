import { body } from 'express-validator';

export const blogInputValidation = [
  body('name').trim().notEmpty().isString().isLength({ min: 2, max: 15 }).withMessage('name is invalid'),
  body('description').trim().notEmpty().isString().isLength({min: 2, max: 500 }).withMessage('description is invalid'),
  body('websiteUrl').trim().notEmpty().isString().isLength({ min: 5, max: 100 })
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  .withMessage('websiteUrl does not match the pattern'),
];
