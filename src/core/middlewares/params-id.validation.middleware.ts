import { param} from 'express-validator';

export const paramsIdValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .trim()
  .notEmpty()
  .withMessage('ID must not be empty') 
  .isString()
  .withMessage('ID must be a string') 
  
 
