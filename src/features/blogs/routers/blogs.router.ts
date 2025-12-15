import express from 'express';
import {  getBlogsListHandler } from './handlers/get-blogs-list.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { getBlogByIdHandler } from './handlers/get-blog-by-id.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';
import { db } from '../../../db/in-memory.db';





export const blogsRouter = express.Router();

blogsRouter
.get('/', getBlogsListHandler(db))
.post('/', createBlogHandler(db))
.get('/:id', getBlogByIdHandler(db))
.put('/:id', updateBlogHandler(db))
.delete('/:id',  deleteBlogHandler(db))

