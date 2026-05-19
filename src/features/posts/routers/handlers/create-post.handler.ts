import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostOutput } from '../output/post.output';
import { PostCreateInput } from '../input/post-create.input';
import { RequestWithBody } from '../../../../core/types/request-types.types';
import { mapToPostOutput } from '../mappers/map-post-output.util';
import { postsService } from '../../application/posts.service';
import { BlogNotFoundError } from '../../application/errors';


export const createPostHandler = async (
  req: RequestWithBody<PostCreateInput>,
  res: Response<PostOutput> & Response<{ errorsMessages: { field: string; message: string }[] }>,
) => {
  try {
    const dto = req.body;
    const createdPost = await postsService.create(dto);
    return res.status(HTTP_STATUSES.CREATED_201).json(mapToPostOutput(createdPost));
  } catch (error) {
    if (error instanceof BlogNotFoundError) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [{ field: 'blogId', message: 'blogId is invalid' }],
      });
    }
    console.error('Create post failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
