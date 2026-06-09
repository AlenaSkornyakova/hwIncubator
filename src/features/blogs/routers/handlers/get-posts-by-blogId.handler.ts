import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams } from '../../../../core/types/request.types';
import { Response } from 'express';
import { blogsService } from '../../ application/blogs.service';
import { mapPost } from '../../../posts/routers/mappers/map-to-post-view-model.util';
import { PaginatedPostsViewModelDto } from '../../../posts/dto/posts.paginated-view.model.dto';
import { matchedData } from 'express-validator/lib/matched-data';
import { postsService } from '../../../posts/application/posts.service';
import { PostsQueryInput } from '../../../posts/types/posts-query-input'; 
import { RequestWithQuery } from '../../../../core/types/request.types';
import { PostsQueryInputModelDto } from '../../../posts/dto/posts.query-imput.dto';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';



export const getPostsByBlogIdHandler = async (
  req: RequestWithParams<{ id: string }>& RequestWithQuery<PostsQueryInputModelDto>,
  res: Response<PaginatedPostsViewModelDto>,
) => {
   
  try {
    const sanitizedQuery = matchedData<PostsQueryInput>(req, {
      locations: ['query' ],
      includeOptionals: true,
    });

    const queryInput: PostsQueryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

         
    const blogId = req.params.id;

    const blog = await blogsService.findById(blogId);
    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    const posts = await postsService.findMany( queryInput, blogId,);

    return res.status(HTTP_STATUSES.OK_200).json({
      ...posts, 
      items: posts.items.map(mapPost)
    });
  } catch (error) {
    console.error('Get posts by blog ID failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
