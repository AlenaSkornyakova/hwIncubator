import express from 'express';
import {  getPostsListHandler } from './handlers/get-posts-list.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';






export const postsRouter = express.Router();

  postsRouter
.get('/', getPostsListHandler)
.post('/', createPostHandler)
.get('/:id', getPostByIdHandler)
.put('/:id', updatePostHandler)
.delete('/:id',  deletePostHandler)

