import { Response } from 'express';
import { matchedData } from 'express-validator/lib/matched-data';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithQuery } from '../../../../core/types/request-types.types';
import { blogsService } from '../../ application/blogs.service';
import { BlogsQueryInput } from '../input/blogs-query-input';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated-output';
import { mapToBlogListPaginatedOutput } from '../mappers/map-blog-list-paginated-output.util';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getBlogsListHandler = async (
  req: RequestWithQuery<Partial<BlogsQueryInput>>,
  res: Response<BlogListPaginatedOutput>,
) => {
  try {
    const sanitizedQuery = matchedData<Partial<BlogsQueryInput>>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput =
      setDefaultSortAndPaginationIfNotExist<BlogsQueryInput['sortBy']>(sanitizedQuery);

    const { items, totalCount } = await blogsService.findMany(queryInput);

    const output = mapToBlogListPaginatedOutput(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    return res.status(HTTP_STATUSES.OK_200).json(output);
  } catch (error) {
    console.error('Get blogs list failed:', error);
    return errorsHandler(error, res);
  }
};
