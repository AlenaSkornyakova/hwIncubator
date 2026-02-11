import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { blogsRepository } from '../../repositories/blogs-db.repository';

export const deleteBlogHandler = async(
  req: RequestWithParams<{ id: string }>,
  res: Response
) => {
    try {
  const id = req.params.id;
  const deleted = await blogsRepository.deleteById(id);
  if (!deleted) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);

    } catch (error) {
    console.error('Delete blog failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
