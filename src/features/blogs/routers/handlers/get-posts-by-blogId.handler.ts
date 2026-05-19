import { Response } from 'express';
import { matchedData } from 'express-validator/lib/matched-data';

import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import {
  RequestWithParams,
  RequestWithQuery,
} from '../../../../core/types/request-types.types';

import { blogsService } from '../../ application/blogs.service';
import { postsService } from '../../../posts/application/posts.service';

import { PostListPaginatedOutput } from '../../../posts/routers/output/post-list-paginated.output';

import { PostsQueryInput } from '../../../posts/routers/input/posts-query-input';

import { mapToPostListPaginatedOutput } from '../../../posts/routers/mappers/map-post-list-paginated-output.util';

export const getPostsByBlogIdHandler = async (
  req: RequestWithParams<{ id: string }> &
    RequestWithQuery<PostsQueryInput>,
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

    const blogId = req.params.id;

    // проверка существования блога
    const blog = await blogsService.findById(blogId);

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }

    const { items, totalCount } = await postsService.findMany(
      queryInput,
      blogId,
    );

    const output = mapToPostListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    return res.status(HTTP_STATUSES.OK_200).json(output);
  } catch (error) {
    console.error('Get posts by blog ID failed:', error);

    return res.sendStatus(
      HTTP_STATUSES.INTERNAL_SERVER_ERROR_500,
    );
  }
};