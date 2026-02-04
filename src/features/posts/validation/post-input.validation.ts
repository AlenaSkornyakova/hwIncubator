import { body } from 'express-validator';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

export const postInputValidation = [
  body('title')
  .isString().withMessage('title must be a string')
  .trim()
  .notEmpty().withMessage('title is required')
  .isLength({ min: 2, max: 30 }).withMessage('title length must be <= 30'),

  body('shortDescription')
  .isString().withMessage('shortDescription must be a string')
  .trim()
  .notEmpty().withMessage('shortDescription is required') 
  .isLength({min: 2, max: 100 }).withMessage('shortDescription length must be <= 100'),

  body('content')
  .isString().withMessage('content must be a string')
  .trim()
  .notEmpty().withMessage('content is required')
  .isLength({ min: 5, max: 1000 }).withMessage('content length must be <= 1000'),

  body('blogId')
  .isString().withMessage('blogId must be a string')
  .trim()
  .notEmpty().withMessage('blogId is required')
  .bail()
  .custom( async (blogId: string) => {
    const blog = await blogsRepository.findById(blogId);
    if (!blog) {
      throw new Error('blogId is invalid');
    }
    return true;
  }),
];