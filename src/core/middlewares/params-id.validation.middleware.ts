import {body, param} from 'express-validator';

export const paramsIdValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .trim()
  .notEmpty()
  .withMessage('ID must not be empty') 
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');
 

 
