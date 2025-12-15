import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { DBType } from '../../../../db/in-memory.db';
import { mapPost } from '../../../../core/utils/mappers';






export const getPostsListHandler = 
     (db: DBType) =>
     (req: Request , res: Response <PostViewModelDto[]>) => {
     res.status(HTTP_STATUSES.OK_200).json(db.posts.map(mapPost));
}