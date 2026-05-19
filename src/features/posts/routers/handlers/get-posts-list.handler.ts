import { Response } from 'express';
import { matchedData } from 'express-validator/lib/matched-data';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithQuery } from '../../../../core/types/request-types.types';
import { postsService } from '../../application/posts.service';
import { PostsQueryInput } from '../input/posts-query-input';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import { mapToPostListPaginatedOutput } from '../mappers/map-post-list-paginated-output.util';

export const getPostsListHandler = async (
  req: RequestWithQuery<Partial<PostsQueryInput>>,
  res: Response<PostListPaginatedOutput>,
) => {
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE = 10;
  const DEFAULT_SORT_BY: PostsQueryInput['sortBy'] = 'createdAt';
  const DEFAULT_SORT_DIRECTION: PostsQueryInput['sortDirection'] = 'desc';

  try {
    const sanitizedQuery = matchedData<Partial<PostsQueryInput>>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput: PostsQueryInput = {
      pageNumber: sanitizedQuery.pageNumber ?? DEFAULT_PAGE_NUMBER,
      pageSize: sanitizedQuery.pageSize ?? DEFAULT_PAGE_SIZE,
      sortBy: sanitizedQuery.sortBy ?? DEFAULT_SORT_BY,
      sortDirection:
        sanitizedQuery.sortDirection ?? DEFAULT_SORT_DIRECTION,
    };

    const { items, totalCount } = await postsService.findMany(queryInput);

    const output = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    return res.status(HTTP_STATUSES.OK_200).json(output);
  } catch (error) {
    console.error('Get posts list failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};