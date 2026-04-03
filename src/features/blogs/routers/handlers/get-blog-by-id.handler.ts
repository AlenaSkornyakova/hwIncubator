import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { mapBlog } from '../mappers/map-to-blog-view-model.util';
import { blogsService } from '../../ application/blogs.service';

export const getBlogByIdHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogViewModelDto>,
) => {
  try {
    const id = req.params.id;
    const blog = await blogsService.findById(id);
    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    return res.status(HTTP_STATUSES.OK_200).json(mapBlog(blog));
  } catch (error) {
    console.error('Get blog by ID failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
