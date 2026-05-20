import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams, RequestWithBody } from '../../../../core/types/request-types.types';
import { postsService } from '../../../posts/application/posts.service';
import { PostByBlogIdCreateInput } from '../../../posts/routers/input/post-by-blog-id-create.input';
import { PostCreateInput } from '../../../posts/routers/input/post-create.input';
import { mapToPostOutput } from '../../../posts/routers/mappers/map-post-output.util';
import { matchedData } from 'express-validator/lib/matched-data';
import { BlogNotFoundError } from '../../../posts/application/errors';
import { PostCreateDto } from '../../../posts/dto/post-create.dto';

export const createPostByBlogIdHandler = async (
  req: RequestWithParams<{ id: string }> & RequestWithBody<PostByBlogIdCreateInput>,
  res: Response,
) => {
  try {
    const sanitizedInput = matchedData<PostByBlogIdCreateInput>(req, {
      locations: ['body', 'params'],
      includeOptionals: true,
    });
    const attributes = sanitizedInput.data.attributes;
    const dto: PostCreateDto = {
      title: attributes.title,
      shortDescription: attributes.shortDescription,
      content: attributes.content,
      blogId: req.params.id,
    };
    const createdPost = await postsService.create(dto);
    return res.status(HTTP_STATUSES.CREATED_201).json(mapToPostOutput(createdPost));
  } catch (error) {
    if (error instanceof BlogNotFoundError) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [{ field: 'blogId', message: 'blogId is invalid' }],
      });
    }
    console.error('Create post by blog ID failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
