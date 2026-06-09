import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';
import { mapPost } from '../mappers/map-to-post-view-model.util';
import { RequestWithQuery } from '../../../../core/types/request.types';
import { PostsQueryInput } from '../../types/posts-query-input';
import { PostsQueryInputModelDto } from '../../dto/posts.query-imput.dto';
import { postsService } from '../../application/posts.service';
import { matchedData } from 'express-validator/lib/matched-data';
import { PaginatedPostsViewModelDto } from '../../dto/posts.paginated-view.model.dto';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';

export const getPostsListHandler = async (
  req: RequestWithQuery<PostsQueryInputModelDto>,
  res: Response<PaginatedPostsViewModelDto>,
) => {
  
  try {
    const sanitizedQuery = matchedData<PostsQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput: PostsQueryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);  
    const posts = await postsService.findMany(queryInput);

    return res.status(HTTP_STATUSES.OK_200).json({
      ...posts,
      items: posts.items.map(mapPost),
    });
  } catch (error) {
    console.error('Get posts list failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
