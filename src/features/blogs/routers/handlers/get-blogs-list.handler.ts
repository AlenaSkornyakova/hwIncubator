import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { mapBlog } from '../mappers/map-to-blog-view-model.util';
import { blogsService } from '../../ application/blogs.service';
import { RequestWithQuery } from '../../../../core/types/request.types';
import { BlogsQueryInputModelDto } from '../../dto/blogs.query-input-model.dto';
import { PaginatedBlogsViewModelDto } from '../../dto/blogs.paginated-view-model.dto';
import { matchedData } from 'express-validator/lib/matched-data';
import { BlogsQueryInput } from '../../types/blogs-query-input';

export const getBlogsListHandler = async (
  req: RequestWithQuery<BlogsQueryInputModelDto>,
  res: Response<PaginatedBlogsViewModelDto>,
) => {
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE = 10;
  const DEFAULT_SEARCH_NAME_TERM = null;
  const DEFAULT_SORT_BY: BlogsQueryInput['sortBy'] = 'createdAt';
  const DEFAULT_SORT_DIRECTION: BlogsQueryInput['sortDirection'] = 'desc';
  
  try {
    const sanitizedQuery = matchedData<BlogsQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const queryInput: BlogsQueryInput = {
      pageNumber: sanitizedQuery.pageNumber ?? DEFAULT_PAGE_NUMBER,
      pageSize: sanitizedQuery.pageSize ?? DEFAULT_PAGE_SIZE,
      searchNameTerm: sanitizedQuery.searchNameTerm ?? DEFAULT_SEARCH_NAME_TERM,
      sortBy: sanitizedQuery.sortBy ?? DEFAULT_SORT_BY,
      sortDirection: sanitizedQuery.sortDirection ?? DEFAULT_SORT_DIRECTION,
    };

    const blogs = await blogsService.findMany(queryInput);

    return res.status(HTTP_STATUSES.OK_200).json({
      ...blogs,
      items: blogs.items.map(mapBlog),
    });
  } catch (error) {
    console.error('Get blogs list failed:', error);
    return res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};

//   const mappedItems = items.map(mapToBlogViewModel);

//   const output = mapToPaginatedOutput({
//     items: mappedItems,
//     page: queryInput.pageNumber,
//     pageSize: queryInput.pageSize,
//     totalCount,
//   });

//   res.status(200).json(output);
// }
