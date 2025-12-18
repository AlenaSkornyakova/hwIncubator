import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { createErrorMessages } from '../../../../core/utils/error.utils';
import { blogsRepository } from '../../repositories/blogs.repository';

export const deleteBlogHandler = (
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogViewModelDto | ErrorResponse>,
) => {
  const id = req.params.id;

  const deleted = blogsRepository.delete(id);

  if (!deleted) {
    res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'blog not found' }]));
    return;
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
