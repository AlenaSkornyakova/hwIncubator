import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostOutput } from '../output/post.output';
import { PostCreateInput } from '../input/post-create.input';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request-types.types';
import { postsService } from '../../application/posts.service';

export const updatePostHandler = async (
  req: RequestWithParams<{ id: string }> & RequestWithBody<PostCreateInput>,
  res: Response<PostOutput>,
) => {
  try {
    const id = req.params.id;
    const updated = await postsService.updateById(id, req.body);

    if (!updated) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

  } catch (error) {
    console.error('Update post failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
