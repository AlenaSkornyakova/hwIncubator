import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { blogsService } from '../../ application/blogs.service';
import { postsRepository } from '../../../posts/repositories/posts-db.repository';
import { mapPost } from '../../../posts/routers/mappers/map-to-post-view-model.util';
import { PostViewModelDto } from '../../../posts/dto/posts.view-model.dto';


 
 export const getPostsByBlogIdHandler = async (
  req: RequestWithParams<{ id: string }>,
  res:  Response <PostViewModelDto[]>
  
) => {
  try {
    const blogId = req.params.id;
    const blog = await blogsService.findById(blogId);
    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    const posts = await postsRepository.findByBlogId(blogId)

    return res.status(200).json(posts.map(mapPost));
  } catch (error) { 
    console.error('Get posts by blog ID failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    
  }
};