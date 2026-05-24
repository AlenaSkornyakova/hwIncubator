import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams, RequestWithBody } from '../../../../core/types/request-types.types';
import { postsService } from '../../../posts/application/posts.service';
import { PostByBlogIdCreateInput } from '../../../posts/routers/input/post-by-blog-id-create.input';
import { mapToPostOutput } from '../../../posts/routers/mappers/map-post-output.util';
import { matchedData } from 'express-validator/lib/matched-data';
import { PostCreateDto } from '../../../posts/dto/post-create.dto';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { PostCreateForBlogDto } from '../../../posts/dto/post-create-for-blog.dto';
import { PostOutput } from '../../../posts/routers/output/post.output';

export const createPostByBlogIdHandler = async (
  req: RequestWithParams<{ id: string }> & RequestWithBody<PostByBlogIdCreateInput>,
  res: Response <PostOutput>,
) => {
  try {
    const sanitizedInput = matchedData<PostByBlogIdCreateInput>(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    const attributes = sanitizedInput.data.attributes;
    const dto: PostCreateForBlogDto = {
      title: attributes.title,
      shortDescription: attributes.shortDescription,
      content: attributes.content,
    };
    const blogId = req.params.id;
    const createdPost = await postsService.createForBlog(blogId, dto);
    return res.status(HTTP_STATUSES.CREATED_201).json(mapToPostOutput(createdPost));
  } catch (error) {
    console.error('Create post by blog ID failed:', error);
    return errorsHandler(error, res);
  }
};
