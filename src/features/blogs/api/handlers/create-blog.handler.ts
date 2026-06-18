import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody } from '../../../../core/types/request-types.types';
import { mapToBlogOutput } from '../mappers/map-blog-output.util';
import { BlogCreateInput } from '../input/blog-crete.input';
import { BlogOutput } from '../output/blog.output';
import { blogsService } from '../../ application/blogs.service';
import { matchedData } from 'express-validator/lib/matched-data';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const createBlogHandler = async (
  req: RequestWithBody<BlogCreateInput>,
  res: Response<BlogOutput>,
) => {
  try {
    const sanitizedInput = matchedData<BlogCreateInput>(req, {
      locations: ['body'],
      includeOptionals: true,
    });

    const dto: BlogCreateInput = {  
      name: sanitizedInput.name,
      description: sanitizedInput.description,
      websiteUrl: sanitizedInput.websiteUrl,
    };
    const createdBlog = await blogsService.create(dto);
    return res.status(HTTP_STATUSES.CREATED_201).json(mapToBlogOutput(createdBlog));
  } catch (error) {
    console.error('Create blog failed:', error);
    return errorsHandler(error, res);
  }
};
