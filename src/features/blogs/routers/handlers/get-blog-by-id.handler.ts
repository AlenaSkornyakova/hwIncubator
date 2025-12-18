import { createErrorMessages } from '../../../../core/utils/error.utils';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { mapBlog } from '../../../../core/utils/mappers';
import { blogsRepository } from '../../repositories/blogs.repository';


export const getBlogByIdHandler = 

  (req: RequestWithParams<{ id: string }>,
  res: Response<BlogViewModelDto | ErrorResponse>,
) => {
  const id = req.params.id;
  const blog = blogsRepository.findById(id);
  if (blog) {
    return res.status(HTTP_STATUSES.OK_200).json(mapBlog(blog));
  }
  return res
    .status(HTTP_STATUSES.NOT_FOUND_404)
    .send(createErrorMessages([{ field: 'id', message: 'blog is not found' }]));
  
}
