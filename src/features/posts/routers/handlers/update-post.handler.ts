import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { PostInputModelDto } from '../../dto/posts.input-model.dto';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request.types';
import { postsRepository } from '../../repositories/posts.repository';

export const updatePostHandler = async(
  req: RequestWithParams<{ id: string }> & RequestWithBody<PostInputModelDto>,
  res: Response<PostViewModelDto >,
) => {

  const id = req.params.id;
  const updated = await postsRepository.update(id, req.body);

  if (!updated) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return;
  }
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
