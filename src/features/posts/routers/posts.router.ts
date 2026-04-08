import express from 'express';
import {  getPostsListHandler } from './handlers/get-posts-list.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { inputValidationResultMiddleware } from '../../../core/middlewares/input-validation.middleware';
import { postInputValidation } from '../validation/post-input.validation';
import { paramsIdValidation } from '../../../core/middlewares/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../../auth/midddlewares/super-admin.guard-middleware';
import { postQueryValidation } from '../validation/post-query.validation';

export const postsRouter = express.Router();

  postsRouter
.get('/', postQueryValidation, inputValidationResultMiddleware, getPostsListHandler)
.post('/',  superAdminGuardMiddleware, postInputValidation, inputValidationResultMiddleware, createPostHandler,)
.get('/:id',  paramsIdValidation,inputValidationResultMiddleware,getPostByIdHandler)
.put('/:id', superAdminGuardMiddleware, paramsIdValidation, postInputValidation, inputValidationResultMiddleware, updatePostHandler) 
.delete('/:id', superAdminGuardMiddleware, paramsIdValidation, inputValidationResultMiddleware, deletePostHandler);