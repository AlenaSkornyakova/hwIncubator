import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { mapBlog } from '../mappers/map-to-blog-view-model.util';
import { blogsService } from '../../ application/blogs.service';

export const getBlogsListHandler = async (
  req: Request, 
  res: Response<BlogViewModelDto[]>) => {
  try {
     
    const blogs = await blogsService.findAll();
    return res.status(HTTP_STATUSES.OK_200).json(blogs.map(mapBlog));

  } catch (error) {
    console.error('Get blogs list failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
