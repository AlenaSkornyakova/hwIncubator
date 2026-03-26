import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams, RequestWithBody } from '../../../../core/types/request.types';
import { postsRepository } from '../../../posts/repositories/posts-db.repository';
import { Post } from '../../../posts/types/post.type';
import { blogsRepository } from '../../repositories/blogs-db.repository';

export const createPostByBlogIdHandler = async (
    req: RequestWithParams<{ id: string }> & RequestWithBody<Post>, res: Response) => {
  try {
    const blogId = req.params.id.toString();
    const blog = await blogsRepository.findById(blogId);
    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    const newPost: Post = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };

    const createdPost = await postsRepository.create(newPost);

    return res.status(HTTP_STATUSES.CREATED_201).json(createdPost);
  } catch (error) {
    console.error('Create post by blog ID failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
