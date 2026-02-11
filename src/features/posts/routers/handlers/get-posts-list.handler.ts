import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { mapPost } from '../mappers/map-to-post-view-model.util';
import { postsRepository } from '../../repositories/posts-db.repository';

export const getPostsListHandler = async (req: Request, res: Response<PostViewModelDto[]>) => {
  try {
    const posts = await postsRepository.findAll();

    return res.status(HTTP_STATUSES.OK_200).json(posts.map(mapPost));
  } catch (error) {
    console.error('Get posts list failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
