import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { blogsRepository } from '../../repositories/blogs.repository';

export const deleteBlogHandler = async(
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogViewModelDto>,
) => {
  const id = req.params.id;
  const deleted = await blogsRepository.delete(id);

  if (!deleted) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);    
    return;
  }
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
};
