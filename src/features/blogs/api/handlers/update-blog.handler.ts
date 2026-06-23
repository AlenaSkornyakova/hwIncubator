import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParamsAndBody } from '../../../../core/types/request-types.types';
import { blogsService } from '../../ application/blogs.service';
import { BlogUpdateInput } from '../input/blog-update.input';
import { matchedData } from 'express-validator/lib/matched-data';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const updateBlogHandler = async (
  req: RequestWithParamsAndBody<{ id: string }, BlogUpdateInput>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    const sanitizedInput = matchedData<BlogUpdateInput>(req, {
      locations: ['body'],
      includeOptionals: true,
    });

    const dto: BlogUpdateInput = {
      name: sanitizedInput.name,
      description: sanitizedInput.description,
      websiteUrl: sanitizedInput.websiteUrl,
    };

    await blogsService.updateById(id, dto);

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (error) {
    console.error('Update blog failed:', error);
    return errorsHandler(error, res);
  }
};
    