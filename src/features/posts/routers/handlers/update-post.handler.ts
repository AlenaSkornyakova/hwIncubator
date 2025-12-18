import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { PostInputModelDto } from '../../dto/posts.input-model.dto';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request.types';
import { createErrorMessages } from '../../../../core/utils/error.utils';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { postsRepository } from '../../repositories/posts.repository';

export const updatePostHandler = (
  req: RequestWithParams<{ id: string }> & RequestWithBody<PostInputModelDto>,
  res: Response<PostViewModelDto | ErrorResponse>,
) => {
  if (!req.body.title || !req.body.shortDescription || !req.body.content || !req.body.blogId) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const id = req.params.id;

  const updated = postsRepository.update(id, req.body);
  if (!updated) {
    res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'post not found' }]));
    return;
  }
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
