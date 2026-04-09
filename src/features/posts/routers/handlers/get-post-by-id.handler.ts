import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { mapPost } from '../mappers/map-to-post-view-model.util';
import { postsService } from '../../application/posts.service';

export const getPostByIdHandler = async (
  req: RequestWithParams<{ id: string }>,
  res: Response<PostViewModelDto>,
) => {
  try {
    const id = req.params.id;
    const post = await postsService.findById(id);

    if (!post) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    return res.status(HTTP_STATUSES.OK_200).json(mapPost(post));
  } catch (error) {
    console.error('Get post by ID failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
