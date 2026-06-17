import {body, param} from 'express-validator';

export const paramsIdValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .trim()
  .notEmpty()
  .withMessage('ID must not be empty') 
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');
 
//needed for PUT /blogs/:id and PUT /posts/:id to ensure that the ID in the URL and in the request body match
  export const dataIdMatchValidation = body('id')
  .exists()
  .withMessage('ID in body is required')
  .custom((value, { req }) => {
    if (value !== req?.params?.id) {
      throw new Error('ID in URL and body must match');
    }
    return true;
  });

 
