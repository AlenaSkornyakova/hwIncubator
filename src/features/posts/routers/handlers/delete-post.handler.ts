import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { postsRepository } from '../../repositories/posts.repository';

export const deletePostHandler  =  async (
  req: RequestWithParams<{ id: string }>,
  res: Response<PostViewModelDto>,
) => {
  const id = req.params.id;
  const deleted = await postsRepository.delete(id);

  if (!deleted) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return;
  }
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
