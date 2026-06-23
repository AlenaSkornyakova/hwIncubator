import { query } from 'express-validator';

export const userQueryValidation = [    
query('searchLoginTerm')
  .optional()
  .isString()
  .trim(),

query('searchEmailTerm')
  .optional()
  .isString()
  .trim(),
]