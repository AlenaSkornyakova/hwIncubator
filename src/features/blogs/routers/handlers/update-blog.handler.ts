import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithBody, RequestWithParams } from '../../../../core/types/request.types';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { BlogInputModelDto } from '../../dto/blogs.input-model.dto';
import { blogsRepository } from '../../repositories/blogs.repository';

export const updateBlogHandler = async (
  req: RequestWithParams<{ id: string }> & RequestWithBody<BlogInputModelDto>,
  res: Response<BlogViewModelDto>,
) => {
  const id = req.params.id;

    const updated = await blogsRepository.update(id, req.body);
    
    if (!updated) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404) 
      return;
    }
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
