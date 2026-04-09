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

export const getPostsListHandler = async (
  req: RequestWithQuery<PostsQueryInputModelDto>,
  res: Response<PaginatedPostsViewModelDto>,
) => {
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE = 10;
  const DEFAULT_SORT_BY: PostsQueryInput['sortBy'] = 'createdAt';
  const DEFAULT_SORT_DIRECTION: PostsQueryInput['sortDirection'] = 'desc';
  try {
    const sanitizedQuery = matchedData<PostsQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput: PostsQueryInput = {
      pageNumber: sanitizedQuery.pageNumber ?? DEFAULT_PAGE_NUMBER,
      pageSize: sanitizedQuery.pageSize ?? DEFAULT_PAGE_SIZE,
      sortBy: sanitizedQuery.sortBy ?? DEFAULT_SORT_BY,
      sortDirection: sanitizedQuery.sortDirection ?? DEFAULT_SORT_DIRECTION,
    };
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
