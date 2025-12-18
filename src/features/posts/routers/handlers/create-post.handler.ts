import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { Post } from '../../types/post.type';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { PostInputModelDto } from '../../dto/posts.input-model.dto';
import { RequestWithBody} from '../../../../core/types/request.types';
import { ErrorResponse } from '../../../../core/types/validation-error.types';
import { mapPost } from '../../../../core/utils/mappers';
import { postsRepository } from '../../repositories/posts.repository';




export const createPostHandler = 
  (req: RequestWithBody<PostInputModelDto>, 
  res: Response<PostViewModelDto | ErrorResponse>) => {
    
          if (!req.body.title || !req.body.shortDescription 
            || !req.body.content || !req.body.blogId) {
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
          }
    
          const newPost: Post = {
            id: new Date().toString(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: 'Blog name placeholder for new Post',
          };
    
          postsRepository.create(newPost);
    
          res.status(HTTP_STATUSES.CREATED_201).json(mapPost(newPost));
        }
    