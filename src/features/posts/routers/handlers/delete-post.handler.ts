import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { createErrorMessages } from '../../../../core/utils/error.utils';
import { postsRepository } from '../../repositories/posts.repository';

export const deletePostHandler = (
  req: RequestWithParams<{ id: string }>,
  res: Response<PostViewModelDto | ErrorResponse>,
) => {
  const id = req.params.id;

  const deleted = postsRepository.delete(id);

  if (!deleted) {
    res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'post not found' }]));
    return;
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
