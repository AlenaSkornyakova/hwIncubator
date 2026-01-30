import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { mapBlog } from '../../../../core/utils/mappers';
import { blogsRepository } from '../../repositories/blogs.repository';


export const getBlogsListHandler = async(
     req: Request,
     res: Response <BlogViewModelDto[]> ) => {
          const blogs = await blogsRepository.findAll();
     res.status(HTTP_STATUSES.OK_200).json(blogs.map(mapBlog));
}    