import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { createErrorMessages } from '../../../../core/utils/error.utils';
import { DBType } from '../../../../db/in-memory.db';

export const deleteBlogHandler = 
  (db: DBType) =>
  (req: RequestWithParams<{ id: string }>, 
  res: Response<BlogViewModelDto | ErrorResponse>) =>{
  const id = req.params.id;
  const index = db.blogs.findIndex((b) => b.id === id);
  if (index > -1) {
    db.blogs.splice(index, 1);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } else {
    res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .send(createErrorMessages([{ field: 'id', message: 'blog not found' }]));
  }
}
