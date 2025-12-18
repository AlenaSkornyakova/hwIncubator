import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request.types';
import { createErrorMessages } from '../../../../core/utils/error.utils';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { BlogInputModelDto } from '../../dto/blogs.input-model.dto';
import { blogsRepository } from '../../repositories/blogs.repository';

export const updateBlogHandler = (
  req: RequestWithParams<{ id: string }> & RequestWithBody<BlogInputModelDto>,
  res: Response<BlogViewModelDto | ErrorResponse>,
) => {
  if (!req.body.name || !req.body.description || !req.body.websiteUrl) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const id = req.params.id;

    const updated = blogsRepository.update(id, req.body);
    
    if (!updated) {
      res
        .status(HTTP_STATUSES.NOT_FOUND_404)
        .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
      return;
    }
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

};
