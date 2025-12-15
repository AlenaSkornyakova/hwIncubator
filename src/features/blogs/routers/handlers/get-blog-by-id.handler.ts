import { createErrorMessages } from '../../../../core/utils/error.utils';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { DBType } from '../../../../db/in-memory.db';
import { mapBlog } from '../../../../core/utils/mappers';


export const getBlogByIdHandler = 
  (db: DBType) =>
  (req: RequestWithParams<{ id: string }>,
  res: Response<BlogViewModelDto | ErrorResponse>,
) => {
  const id = req.params.id;
  const blog = db.blogs.find((b) => b.id === id);
  if (!blog) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'blog not found' }]));
  }
  return res.status(HTTP_STATUSES.OK_200).json(mapBlog(blog));
}
