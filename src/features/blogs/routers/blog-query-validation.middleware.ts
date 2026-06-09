import { query } from 'express-validator';

export const blogQueryValidation = [
  query('searchNameTerm')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('searchNameTerm must be a string with length between 1 and 100'),
];