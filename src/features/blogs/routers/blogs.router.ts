import express from 'express';
import {  getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { blogInputValidation } from '../validation/blog-input.validation';
import { inputValidationResultMiddleware } from '../../../core/middlewares/input-validation.middleware';
import { paramsIdValidation } from '../../../core/middlewares/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../../auth/midddlewares/super-admin.guard-middleware';

export const blogsRouter = express.Router();

blogsRouter
.get('/', getBlogsListHandler)
.post('/', superAdminGuardMiddleware, blogInputValidation, inputValidationResultMiddleware,createBlogHandler )
.get('/:id', paramsIdValidation, inputValidationResultMiddleware, getBlogByIdHandler)
.put('/:id', superAdminGuardMiddleware, paramsIdValidation, blogInputValidation, inputValidationResultMiddleware, updateBlogHandler)
.delete('/:id', superAdminGuardMiddleware, paramsIdValidation, inputValidationResultMiddleware, deleteBlogHandler)