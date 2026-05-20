import { body } from 'express-validator';
import { blogsRepository } from '../../blogs/repositories/blogs-db.repository';
import { ResourceType } from '../../../core/types/resource-type.types';
import { resourceTypeValidation } from '../../../core/middlewares/resource-type.validation-middleware';
import { dataIdMatchValidation } from '../../../core/middlewares/params-id.validation.middleware';

export const postBaseValidation = [
  resourceTypeValidation(ResourceType.Posts),

  body('data.attributes.title')
    .isString()
    .withMessage('title must be a string')
    .trim()
    .notEmpty()
    .withMessage('title is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('title length must be min: 2, max: 30'),

  body('data.attributes.shortDescription')
    .isString()
    .withMessage('shortDescription must be a string')
    .trim()
    .notEmpty()
    .withMessage('shortDescription is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('shortDescription length must be min: 2, max: 100'),

  body('data.attributes.content')
    .isString()
    .withMessage('content must be a string')
    .trim()
    .notEmpty()
    .withMessage('content is required')
    .isLength({ min: 5, max: 1000 })
    .withMessage('content length must be min: 5, max: 1000'),
];

const blogIdValidation = body('data.attributes.blogId')
  .isString()
  .withMessage('blogId must be a string')
  .trim()
  .notEmpty()
  .withMessage('blogId is required')
  .bail()
  .custom(async (blogId: string) => {
    const blog = await blogsRepository.findById(blogId);

    if (!blog) {
      throw new Error('blogId is invalid');
    }

    return true;
  });

export const postCreateInputValidation = [
  ...postBaseValidation,
  blogIdValidation,
];

export const postUpdateInputValidation = [
  dataIdMatchValidation,
  ...postBaseValidation,
  blogIdValidation,
];

export const createPostForBlogInputValidation = [
  ...postBaseValidation,
];