import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { PostInputModelDto } from '../../dto/posts.input-model.dto';
import { DBType } from '../../../../db/in-memory.db';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request.types';
import { createErrorMessages } from '../../../../core/utils/error.utils';
import { ErrorResponse } from '../../../../core/types/validation-error.types';

export const updatePostHandler = 
  (db: DBType) =>
  (req: RequestWithParams<{ id: string }> & RequestWithBody<PostInputModelDto>,
  res: Response<PostViewModelDto | ErrorResponse>,
) => {
  const id = req.params.id;
  const post = db.posts.find((p) => p.id === id);
  if (!post) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'post not found' }]));
  }

  if (!req.body.title || !req.body.shortDescription 
            || !req.body.content || !req.body.blogId) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
          }
  post.title = req.body.title;
  post.shortDescription = req.body.shortDescription;
  post.content = req.body.content;
  post.blogId = req.body.blogId;

  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
}
