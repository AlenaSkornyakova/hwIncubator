import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request-types.types';
import { Response } from 'express';
import { BlogOutput } from '../output/blog.output';
import { mapToBlogOutput } from '../mappers/map-blog-output.util';
import { blogsService } from '../../ application/blogs.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getBlogByIdHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogOutput>,
) => {
  try {
    const id = req.params.id;
    const blog = await blogsService.findByIdOrFail(id);
    
    return res.status(HTTP_STATUSES.OK_200).json(mapToBlogOutput(blog));
  } catch (error) {
    console.error('Get blog by ID failed:', error);
    return errorsHandler(error, res);
  }
};
