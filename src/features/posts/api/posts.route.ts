import express from 'express';
import {  getPostsListHandler } from './handlers/get-posts-list.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { inputValidationResultMiddleware } from '../../../core/middlewares/input-validation-result.middleware';
import { postCreateInputValidation, postUpdateInputValidation } from './middlewares/post-input-validation.middleware';
import { paramsIdValidation } from '../../../core/middlewares/params-id.validation.middleware';
import { superAdminGuardMiddleware } from '../../../auth/api/middlewares/super-admin.guard-middleware';
import { paginationAndSortingValidation } from '../../../core/middlewares/query-pagination-sorting.validation-middleware';
import { postSortFields } from './input/posts-sort-fields';

export const postsRouter = express.Router();

  postsRouter
.get('/', paginationAndSortingValidation(postSortFields), inputValidationResultMiddleware, getPostsListHandler)
.post('/',  superAdminGuardMiddleware, postCreateInputValidation, inputValidationResultMiddleware, createPostHandler,)
.get('/:id',  paramsIdValidation,inputValidationResultMiddleware,getPostByIdHandler)
.put('/:id', superAdminGuardMiddleware, paramsIdValidation, postUpdateInputValidation, inputValidationResultMiddleware, updatePostHandler) 
.delete('/:id', superAdminGuardMiddleware, paramsIdValidation, inputValidationResultMiddleware, deletePostHandler);