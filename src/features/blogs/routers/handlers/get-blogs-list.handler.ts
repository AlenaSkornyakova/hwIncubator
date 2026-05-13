import { Response } from 'express';
import { matchedData } from 'express-validator/lib/matched-data';

import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithQuery } from '../../../../core/types/request.types';

import { blogsService } from '../../ application/blogs.service';
import { BlogsQueryInput } from '../input/blogs-query-input';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated-output';
import { mapToBlogListPaginatedOutput } from '../mappers/map-blog-list-paginated-output.util';

export const getBlogsListHandler = async (
  req: RequestWithQuery<Partial<BlogsQueryInput>>,
  res: Response<BlogListPaginatedOutput>,
) => {
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE = 10;
  const DEFAULT_SORT_BY: BlogsQueryInput['sortBy'] = 'createdAt';
  const DEFAULT_SORT_DIRECTION: BlogsQueryInput['sortDirection'] = 'desc';

  try {
    const sanitizedQuery = matchedData<Partial<BlogsQueryInput>>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput: BlogsQueryInput = {
      pageNumber: sanitizedQuery.pageNumber ?? DEFAULT_PAGE_NUMBER,
      pageSize: sanitizedQuery.pageSize ?? DEFAULT_PAGE_SIZE,
      searchNameTerm: sanitizedQuery.searchNameTerm,
      sortBy: sanitizedQuery.sortBy ?? DEFAULT_SORT_BY,
      sortDirection: sanitizedQuery.sortDirection ?? DEFAULT_SORT_DIRECTION,
    };

    const { items, totalCount } = await blogsService.findMany(queryInput);

    const output = mapToBlogListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    return res.status(HTTP_STATUSES.OK_200).json(output);
  } catch (error) {
    console.error('Get blogs list failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};