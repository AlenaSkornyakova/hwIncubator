import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request-types.types';
import { Response } from 'express';
import { BlogOutput } from '../output/blog.output';
import { mapToBlogOutput } from '../mappers/map-blog-output.util';
import { blogsService } from '../../ application/blogs.service';

export const getBlogByIdHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogOutput>,
) => {
  try {
    const id = req.params.id;
    const blog = await blogsService.findById(id);
    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    return res.status(HTTP_STATUSES.OK_200).json(mapToBlogOutput(blog));
  } catch (error) {
    console.error('Get blog by ID failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
