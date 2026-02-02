import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { mapBlog } from '../../../../core/utils/mappers';
import { blogsRepository } from '../../repositories/blogs.repository';


export const getBlogByIdHandler = async(
  req: RequestWithParams<{ id: string }>,
  res: Response<BlogViewModelDto>,
) => {
  const id = req.params.id;
  const blog = await blogsRepository.findById(id);
  if (!blog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.status(HTTP_STATUSES.OK_200).json(mapBlog(blog));
}