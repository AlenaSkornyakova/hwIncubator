import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostOutput } from '../output/post.output';
import { PostCreateInput } from '../input/post-create.input';
import { RequestWithBody } from '../../../../core/types/request-types.types';
import { mapToPostOutput } from '../mappers/map-post-output.util';
import { postsService } from '../../application/posts.service';
import { matchedData } from 'express-validator/lib/matched-data';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const createPostHandler = async (
  req: RequestWithBody<PostCreateInput>,
  res: Response<PostOutput> 
) => {
  try {
    const sanitizedInput = matchedData<PostCreateInput>(req, {
      locations: ['body'],
      includeOptionals: true,
    });

    const dto: PostCreateInput = {
      title: sanitizedInput.title,
      shortDescription: sanitizedInput.shortDescription,
      content: sanitizedInput.content,
      blogId: sanitizedInput.blogId,
    };
    const createdPost = await postsService.create(dto);
    return res.status(HTTP_STATUSES.CREATED_201).json(mapToPostOutput(createdPost));
  } catch (error) {
    console.error('Create post failed:', error);
    return errorsHandler(error, res);
  }
};
