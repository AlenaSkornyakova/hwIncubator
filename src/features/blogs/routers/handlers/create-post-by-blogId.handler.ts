import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams, RequestWithBody } from '../../../../core/types/request.types';
import { postsService } from '../../../posts/application/posts.service';
import { CreatePostByBlogIdInputDto } from '../../dto/blogs.create-post-by-blogId.dto';
import { PostInputModelDto } from '../../../posts/dto/posts.input-model.dto';
import { mapPost } from '../../../posts/routers/mappers/map-to-post-view-model.util';
import { matchedData } from 'express-validator/lib/matched-data';
import { BlogNotFoundError } from '../../../posts/application/errors';



export const createPostByBlogIdHandler = async (
    req: RequestWithParams<{ id: string }> & RequestWithBody<CreatePostByBlogIdInputDto>, 
    res: Response,
 ) => {
  try {
     const sanitizedQuery = matchedData<CreatePostByBlogIdInputDto>(req, {
          locations: ['body', 'params'],
          includeOptionals: true,
        });
      const dto: PostInputModelDto = {
      title: sanitizedQuery.title,
      shortDescription: sanitizedQuery.shortDescription,
      content: sanitizedQuery.content,
      blogId: req.params.id,
    };
    const createdPost = await postsService.create(dto);
    return res.status(HTTP_STATUSES.CREATED_201).json(mapPost(createdPost));
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
