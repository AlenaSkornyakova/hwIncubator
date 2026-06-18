import { body } from 'express-validator';


const nameValidation = body('name')
  .isString()
  .withMessage('name should be string')
  .trim()
  .notEmpty()
  .withMessage('name is required')
  .isLength({ min: 2, max: 15 })
  .withMessage(
    'name is invalid, it must be a string with length between 2 and 15 characters',
  );

const descriptionValidation = body('description')
  .isString()
  .withMessage('description should be string')
  .trim()
  .notEmpty()
  .withMessage('description is required')
  .isLength({ min: 2, max: 500 })
  .withMessage(
    'description is invalid, it must be a string with length between 2 and 500 characters',
  );

const websiteUrlValidation = body('websiteUrl')
  .isString()
  .withMessage('websiteUrl should be string')
  .trim()
  .notEmpty()
  .withMessage('websiteUrl is required')
  .isLength({ min: 5, max: 100 })
  .withMessage(
    'websiteUrl is invalid, it must be a string with length between 5 and 100 characters',
  )
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage('websiteUrl must match valid https URL pattern');

export const blogCreateInputValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];

export const blogUpdateInputValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
