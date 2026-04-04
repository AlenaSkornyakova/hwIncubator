import express from 'express';
import {  getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { getPostsByBlogIdHandler  } from './handlers/get-posts-by-blogId.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { blogInputValidation } from '../validation/blog-input.validation';
import { inputValidationResultMiddleware } from '../../../core/middlewares/input-validation.middleware';
import { paramsIdValidation } from '../../../core/middlewares/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../../auth/midddlewares/super-admin.guard-middleware';
import { createPostByBlogIdHandler } from './handlers/create-post-by-blogId.handler';
import { createPostForBlogInputValidation } from '../../posts/validation/post-input.validation';
import { blogQueryValidation } from '../validation/blog-query.validation';

   

export const blogsRouter = express.Router();

blogsRouter
.get('/', blogQueryValidation, inputValidationResultMiddleware, getBlogsListHandler)
.post('/', superAdminGuardMiddleware, blogInputValidation, inputValidationResultMiddleware,createBlogHandler )
.post('/:id/posts', superAdminGuardMiddleware, paramsIdValidation, createPostForBlogInputValidation, inputValidationResultMiddleware, createPostByBlogIdHandler)
.get('/:id', paramsIdValidation, inputValidationResultMiddleware, getBlogByIdHandler)
.get ('/:id/posts',paramsIdValidation, inputValidationResultMiddleware, getPostsByBlogIdHandler)
.put('/:id', superAdminGuardMiddleware, paramsIdValidation, blogInputValidation, inputValidationResultMiddleware, updateBlogHandler)
.delete('/:id', superAdminGuardMiddleware, paramsIdValidation, inputValidationResultMiddleware, deleteBlogHandler)