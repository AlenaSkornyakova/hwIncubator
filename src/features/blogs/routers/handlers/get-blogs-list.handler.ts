import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { DBType } from '../../../../db/in-memory.db';
import { mapBlog } from '../../../../core/utils/mappers';






export const getBlogsListHandler = 
     (db: DBType) =>
     (req: Request , res: Response <BlogViewModelDto[]> ) => {
     res.status(HTTP_STATUSES.OK_200).json(db.blogs.map(mapBlog));
}