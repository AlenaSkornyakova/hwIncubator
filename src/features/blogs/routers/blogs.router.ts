import express from 'express';
import {  getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { blogInputValidation } from '../validation/blog-input.validation';
import { inputValidationResultMiddleware } from '../../../core/middlewares/input-validation.middleware';
import { paramsIdValidation } from '../../../core/middlewares/params-id.validation.middleware';

export const blogsRouter = express.Router();



blogsRouter
.get('/', getBlogsListHandler)
.post('/', blogInputValidation, inputValidationResultMiddleware,createBlogHandler )
.get('/:id', paramsIdValidation, inputValidationResultMiddleware, getBlogByIdHandler)
.put('/:id', paramsIdValidation, blogInputValidation, inputValidationResultMiddleware, updateBlogHandler)
.delete('/:id', paramsIdValidation, inputValidationResultMiddleware, deleteBlogHandler)