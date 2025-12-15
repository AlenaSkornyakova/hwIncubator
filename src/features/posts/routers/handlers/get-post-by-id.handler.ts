import { createErrorMessages } from '../../../../core/utils/error.utils';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { DBType } from '../../../../db/in-memory.db';
import { mapPost } from '../../../../core/utils/mappers';


export const getPostByIdHandler = 
  (db: DBType) =>
  (req: RequestWithParams<{ id: string }>,
  res: Response<PostViewModelDto | ErrorResponse>,
) => {
  const id = req.params.id;
  const post = db.posts.find((p) => p.id === id);
  if (!post) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'post not found' }]));
  }
  return res.status(HTTP_STATUSES.OK_200).json(mapPost(post));
}
