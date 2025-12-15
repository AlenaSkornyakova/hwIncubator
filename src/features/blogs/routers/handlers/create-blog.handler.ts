import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody} from '../../../../core/types/request.types';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { DBType } from '../../../../db/in-memory.db';
import { mapBlog } from '../../../../core/utils/mappers';
import { BlogInputModelDto } from '../../dto/blogs.input-model.dto';
 import { BlogViewModelDto } from '../../dto/blogs.view-model.dto'; 
import { Blog } from '../../types/blogs.type';

export const createBlogHandler = 
  (db: DBType) =>
  (req: RequestWithBody<BlogInputModelDto>, 
  res: Response<BlogViewModelDto | ErrorResponse>) => {

          if (!req.body.name || !req.body.description 
            || !req.body.websiteUrl) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
          }

          const newBlog: Blog = {
            id: new Date().toString(),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
          };
    
          db.blogs.push(newBlog);
    
          res.status(HTTP_STATUSES.CREATED_201).json(mapBlog(newBlog));
        }
    