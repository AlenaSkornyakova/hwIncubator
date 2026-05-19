import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request-types.types';
import { Response } from 'express';
import { PostOutput } from '../output/post.output';
import { mapToPostOutput } from '../mappers/map-post-output.util';
import { postsService } from '../../application/posts.service';

export const getPostByIdHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response<PostOutput>,
) => {
  try {
    const id = req.params.id;
    const post = await postsService.findById(id);

    if (!post) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    return res.status(HTTP_STATUSES.OK_200).json(mapToPostOutput(post));
  } catch (error) {
    console.error('Get post by ID failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
