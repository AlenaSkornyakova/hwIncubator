import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody } from '../../../../core/types/request-types.types';
import { mapToBlogOutput } from '../mappers/map-blog-output.util';
import { BlogCreateInput } from '../input/blog-crete.input';
import { BlogOutput } from '../output/blog.output';
import { blogsService } from '../../ application/blogs.service';
import { matchedData } from 'express-validator/lib/matched-data';
import { BlogCreateDto } from '../../dto/blog-create.dto';

export const createBlogHandler = async (
  req: RequestWithBody<BlogCreateInput>,
  res: Response<BlogOutput>,
) => {
  try {
    const sanitizedInput = matchedData<BlogCreateInput>(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    const attributes = sanitizedInput.data.attributes;
    const dto: BlogCreateDto = {  
      name: attributes.name,
      description: attributes.description,
      websiteUrl: attributes.websiteUrl,
    };
    console.log('Creating blog with DTO:', dto);  
    const createdBlog = await blogsService.create(dto);
    return res.status(HTTP_STATUSES.CREATED_201).json(mapToBlogOutput(createdBlog));
  } catch (error) {
    console.error('Create blog failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
