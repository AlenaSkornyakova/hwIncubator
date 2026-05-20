import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostOutput } from '../output/post.output';
import { PostCreateInput } from '../input/post-create.input';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request-types.types';
import { postsService } from '../../application/posts.service';
import { PostUpdateInput } from '../input/post-update.input';
import { matchedData } from 'express-validator/lib/matched-data';
import { PostUpdateDto } from '../../dto/post-update.dto';

export const updatePostHandler = async (
  req: RequestWithParams<{ id: string }> & RequestWithBody<PostUpdateInput>,
  res: Response<PostOutput>,
) => {
  try {
    const sanitizedInput = matchedData<PostUpdateInput>(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    const attributes = sanitizedInput.data.attributes;
    const dto: PostUpdateDto = {
      title: attributes.title,
      shortDescription: attributes.shortDescription,
      content: attributes.content,
      blogId: attributes.blogId,
    };
    const id = req.params.id;
    const updated = await postsService.updateById(id, dto);

    if (!updated) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (error) {
    console.error('Update post failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
