import express from 'express';
import {  getPostsListHandler } from './handlers/get-posts-list.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';
import { db } from '../../../db/in-memory.db';






export const postsRouter = express.Router();

  postsRouter
.get('/', getPostsListHandler(db))
.post('/', createPostHandler(db))
.get('/:id', getPostByIdHandler(db))
.put('/:id', updatePostHandler(db))
.delete('/:id',  deletePostHandler(db))

