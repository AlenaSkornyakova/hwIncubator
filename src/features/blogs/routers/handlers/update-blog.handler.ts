import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request-types.types';
import { BlogCreateInput } from '../input/blog-crete.input';
import { blogsService } from '../../ application/blogs.service';
import { BlogUpdateDto } from '../../dto/blog-update.dto';
import { BlogUpdateInput } from '../input/blog-update.input';
import { matchedData } from 'express-validator/lib/matched-data';

export const updateBlogHandler = async (
  req: RequestWithParams<{ id: string }> & RequestWithBody<BlogUpdateInput>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const input = matchedData<BlogUpdateInput>(req, {
      locations: ['body'],
      includeOptionals: true,
    });

    const attributes = input.data.attributes;

    const dto: BlogUpdateDto = {
      name: attributes.name,
      description: attributes.description,
      websiteUrl: attributes.websiteUrl,
    };

    const updated = await blogsService.updateById(id, dto);

    if (!updated) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (error) {
    console.error('Update blog failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
