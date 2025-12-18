import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { mapPost } from '../../../../core/utils/mappers';
import { postsRepository } from '../../repositories/posts.repository';






export const getPostsListHandler = 
     (req: Request , res: Response <PostViewModelDto[]>) => {
          const posts = postsRepository.findAll();
     res.status(HTTP_STATUSES.OK_200).json(posts.map(mapPost));
}