import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { DBType } from '../../../../db/in-memory.db';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request.types';
import { createErrorMessages } from '../../../../core/utils/error.utils';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { BlogInputModelDto } from '../../dto/blogs.input-model.dto';

export const updateBlogHandler = 
 (db: DBType) =>
  (req: RequestWithParams<{ id: string }> & RequestWithBody<BlogInputModelDto>,
  res: Response<BlogViewModelDto | ErrorResponse>,
) => {
  const id = req.params.id;
  const blog = db.blogs.find((b) => b.id === id);
  if (!blog) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
  }

  if (!req.body.name || !req.body.description 
            || !req.body.websiteUrl) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
          }
  blog.name = req.body.name;
  blog.description = req.body.description;
  blog.websiteUrl = req.body.websiteUrl;
  return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
}
