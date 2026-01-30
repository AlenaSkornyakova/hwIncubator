import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { mapPost } from '../../../../core/utils/mappers';
import { postsRepository } from '../../repositories/posts.repository';


export const getPostByIdHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response<PostViewModelDto>,
) => {
  const id = req.params.id;
  const post = await postsRepository.findById(id);
  
  if (!post) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
  return res.status(HTTP_STATUSES.OK_200).json(mapPost(post));
}
