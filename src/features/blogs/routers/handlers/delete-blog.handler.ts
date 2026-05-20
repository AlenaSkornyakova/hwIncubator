import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request-types.types';
import { blogsService } from '../../ application/blogs.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const deleteBlogHandler = async(
  req: RequestWithParams<{ id: string }>,
  res: Response
) => {
    try {
  const id = req.params.id;
  await blogsService.deleteById(id);
  
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

    } catch (error) {
    console.error('Delete blog failed:', error);
    return errorsHandler(error, res);
  }
};
