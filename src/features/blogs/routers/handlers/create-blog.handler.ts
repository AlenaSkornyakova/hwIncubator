import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody} from '../../../../core/types/request-types.types';
import { mapToBlogOutput } from '../mappers/map-blog-output.util';
import { BlogCreateInput } from '../input/blog-crete.input';
 import { BlogOutput } from '../output/blog.output'; 
import { blogsService } from '../../ application/blogs.service';

export const createBlogHandler = async (
  req: RequestWithBody<BlogCreateInput>,
  res: Response<BlogOutput>
) => {
  try {
    const createdBlog = await blogsService.create((req.body));
    return res
      .status(HTTP_STATUSES.CREATED_201)
      .json(mapToBlogOutput(createdBlog));

  } catch (error) {
    console.error('Create blog failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
