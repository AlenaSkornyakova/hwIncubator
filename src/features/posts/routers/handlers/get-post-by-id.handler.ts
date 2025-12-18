import { createErrorMessages } from '../../../../core/utils/error.utils';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { mapPost } from '../../../../core/utils/mappers';
import { postsRepository } from '../../repositories/posts.repository';


export const getPostByIdHandler = 
  (req: RequestWithParams<{ id: string }>,
  res: Response<PostViewModelDto | ErrorResponse>,
) => {
  const id = req.params.id;
  const post = postsRepository.findById(id);
  if (!post) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'post not found' }]));
  }
  return res.status(HTTP_STATUSES.OK_200).json(mapPost(post));
}
