import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request-types.types';
import { Response } from 'express';
import { PostOutput } from '../output/post.output';
import { mapToPostOutput } from '../mappers/map-post-output.util';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getPostByIdHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response<PostOutput>
) => {
  try {
    const id = req.params.id;
    const post = await postsService.findByIdOrFail(id);
    return res.status(HTTP_STATUSES.OK_200).json(mapToPostOutput(post));
  } catch (error) {
    console.error('Get post by ID failed:', error);
    return errorsHandler(error, res);
  }
};
