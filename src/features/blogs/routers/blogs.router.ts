import express from 'express';
import {  getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';

export const blogsRouter = express.Router();

blogsRouter
.get('/', getBlogsListHandler)
.post('/', createBlogHandler)
.get('/:id', getBlogByIdHandler)
.put('/:id', updateBlogHandler)
.delete('/:id',  deleteBlogHandler)
