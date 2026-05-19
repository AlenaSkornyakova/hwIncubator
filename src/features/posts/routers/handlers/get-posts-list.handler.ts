import { Response } from 'express';
import { matchedData } from 'express-validator/lib/matched-data';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithQuery } from '../../../../core/types/request-types.types';
import { postsService } from '../../application/posts.service';
import { PostsQueryInput } from '../input/posts-query-input';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import { mapToPostListPaginatedOutput } from '../mappers/map-post-list-paginated-output.util';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';

export const getPostsListHandler = async (
  req: RequestWithQuery<Partial<PostsQueryInput>>,
  res: Response<PostListPaginatedOutput>,
) => {
  try {
    const sanitizedQuery = matchedData<Partial<PostsQueryInput>>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput: PostsQueryInput = setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

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
