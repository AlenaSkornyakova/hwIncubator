import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request-types.types';
import { BlogCreateInput } from '../input/blog-crete.input';
import { blogsService } from '../../ application/blogs.service';

export const updateBlogHandler = async (
  req: RequestWithParams<{ id: string }> & RequestWithBody<BlogCreateInput>,
  res: Response,
) => {
  try {
    const id = req.params.id;

    const updated = await blogsService.updateById(id, req.body);

    if (!updated) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

  } catch (error) {
    console.error('Update blog failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
