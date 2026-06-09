import { Response } from 'express';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { mapBlog } from '../mappers/map-to-blog-view-model.util';
import { blogsService } from '../../ application/blogs.service';
import { RequestWithQuery } from '../../../../core/types/request.types';
import { BlogsQueryInputModelDto } from '../../dto/blogs.query-input-model.dto';
import { PaginatedBlogsViewModelDto } from '../../dto/blogs.paginated-view-model.dto';
import { matchedData } from 'express-validator/lib/matched-data';
import { BlogsQueryInput } from '../../types/blogs-query-input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination'; 

export const getBlogsListHandler = async (
  req: RequestWithQuery<BlogsQueryInputModelDto>,
  res: Response<PaginatedBlogsViewModelDto>,
) => {
  
  try {
    console.log('REQ QUERY:', req.query);

    const sanitizedQuery = matchedData<BlogsQueryInput>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
console.log('SANITIZED QUERY:', sanitizedQuery);
    const queryInput: BlogsQueryInput = setDefaultSortAndPaginationIfNotExist<BlogsQueryInput['sortBy']>(sanitizedQuery);

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
