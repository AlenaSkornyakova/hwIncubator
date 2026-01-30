import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { Post } from '../../types/post.type';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { PostInputModelDto } from '../../dto/posts.input-model.dto';
import { RequestWithBody} from '../../../../core/types/request.types';
import { mapPost } from '../../../../core/utils/mappers';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';


export const createPostHandler = async (
  req: RequestWithBody<PostInputModelDto>, 
  res: Response<PostViewModelDto>) => {

    const { title, shortDescription, content, blogId } = req.body;
    const blog = await blogsRepository.findById(blogId);

          const newPost: Post = {
            id: new Date().toString(),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
             blogName: blog!.name,
          };
    
          await postsRepository.create(newPost);
    
          return res.status(HTTP_STATUSES.CREATED_201).json(mapPost(newPost));
        }
    