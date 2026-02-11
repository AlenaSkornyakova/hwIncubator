import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { Post } from '../../types/post.type';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { PostInputModelDto } from '../../dto/posts.input-model.dto';
import { RequestWithBody } from '../../../../core/types/request.types';
import { mapPost } from '../mappers/map-to-post-view-model.util';
import { postsRepository } from '../../repositories/posts-db.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs-db.repository';

export const createPostHandler = async (
  req: RequestWithBody<PostInputModelDto>,
  res: Response<PostViewModelDto>,
) => {
  try {
    const { title, shortDescription, content, blogId } = req.body;
    const blog = await blogsRepository.findById(blogId);
    if (!blog) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [{ field: 'blogId', message: 'blogId is invalid' }],
      } as any);
    }
    const newPost: Post = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };

    const createdPost = await postsRepository.create(newPost);
    return res.status(HTTP_STATUSES.CREATED_201).json(mapPost(createdPost));

  } catch (error) {
    console.error('Create post failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
