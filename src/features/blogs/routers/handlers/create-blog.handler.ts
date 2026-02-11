import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody} from '../../../../core/types/request.types';
import { mapBlog } from '../mappers/map-to-blog-view-model.util';
import { BlogInputModelDto } from '../../dto/blogs.input-model.dto';
 import { BlogViewModelDto } from '../../dto/blogs.view-model.dto'; 
import { Blog } from '../../types/blog.type';
import { blogsRepository } from '../../repositories/blogs-db.repository';

export const createBlogHandler = async (
  req: RequestWithBody<BlogInputModelDto>,
  res: Response<BlogViewModelDto>
) => {
  try {
    const newBlog: Blog = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
    };

    const createdBlog = await blogsRepository.create(newBlog);

    return res
      .status(HTTP_STATUSES.CREATED_201)
      .json(mapBlog(createdBlog));

  } catch (error) {
    console.error('Create blog failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
