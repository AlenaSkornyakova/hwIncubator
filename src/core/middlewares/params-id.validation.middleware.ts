import {body, param} from 'express-validator';

export const paramsIdValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .trim()
  .notEmpty()
  .withMessage('ID must not be empty') 
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');
 
  export const dataIdMatchValidation = body('data.id')
  .exists()
  .withMessage('ID in body is required')
  .custom((value, { req }) => {
    if (value !== req?.params?.id) {
      throw new Error('ID in URL and body must match');
    }
    return true;
  });
 
