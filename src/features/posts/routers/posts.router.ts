import express from 'express';
import {  getPostsListHandler } from './handlers/get-posts-list.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { inputValidationResultMiddleware } from '../../../core/middlewares/input-validation.middleware';
import { postInputValidation } from '../validation/post-input.validation';
import { paramsIdValidation } from '../../../core/middlewares/params-id.validation.middleware';

export const postsRouter = express.Router();

  postsRouter
.get('/', getPostsListHandler)
.post('/',  postInputValidation, inputValidationResultMiddleware, createPostHandler,)
.get('/:id',  paramsIdValidation,inputValidationResultMiddleware,getPostByIdHandler)
.put('/:id',  paramsIdValidation, postInputValidation, inputValidationResultMiddleware, updatePostHandler) 
.delete('/:id',  paramsIdValidation, inputValidationResultMiddleware, deletePostHandler);