import express from 'express';
import {  getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { getPostsByBlogIdHandler  } from './handlers/get-posts-by-blogId.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { inputValidationResultMiddleware } from '../../../core/middlewares/input-validation-result.middleware';
import { paramsIdValidation } from '../../../core/middlewares/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../../auth/midddlewares/super-admin.guard-middleware';
import { createPostByBlogIdHandler } from './handlers/create-post-by-blogId.handler';
import { createPostForBlogInputValidation } from '../../posts/routers/post-input-dto-validation.middleware';
import { paginationAndSortingValidation } from '../../../core/middlewares/query-pagination-sorting.validation-middleware';
import { blogSortFields } from './input/blog-sort-fields';
import { blogCreateInputValidation, blogUpdateInputValidation } from '../routers/blog-input-dto-validation.middleware';
import { postSortFields } from '../../posts/routers/input/posts-sort-fields';

   

export const blogsRouter = express.Router();

blogsRouter
.get('/', paginationAndSortingValidation(blogSortFields), inputValidationResultMiddleware, getBlogsListHandler)
.post('/', superAdminGuardMiddleware, blogCreateInputValidation, inputValidationResultMiddleware,createBlogHandler )
.post('/:id/posts', superAdminGuardMiddleware, paramsIdValidation, createPostForBlogInputValidation, inputValidationResultMiddleware, createPostByBlogIdHandler)
.get('/:id', paramsIdValidation, inputValidationResultMiddleware, getBlogByIdHandler)
.get ('/:id/posts',paramsIdValidation,  paginationAndSortingValidation(postSortFields), inputValidationResultMiddleware, getPostsByBlogIdHandler)
.put('/:id', superAdminGuardMiddleware, paramsIdValidation, blogUpdateInputValidation, inputValidationResultMiddleware, updateBlogHandler)
.delete('/:id', superAdminGuardMiddleware, paramsIdValidation, inputValidationResultMiddleware, deleteBlogHandler)