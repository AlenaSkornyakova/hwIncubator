import { Response } from 'express';
import { matchedData } from 'express-validator/lib/matched-data';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithParams, RequestWithQuery } from '../../../../core/types/request-types.types';
import { blogsService } from '../../ application/blogs.service';
import { postsService } from '../../../posts/application/posts.service';
import { PostListPaginatedOutput } from '../../../posts/routers/output/post-list-paginated.output';
import { PostsQueryInput } from '../../../posts/routers/input/posts-query-input';
import { mapToPostListPaginatedOutput } from '../../../posts/routers/mappers/map-post-list-paginated-output.util';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { errorsHandler } from '../../../../core/errors/errors.handler';

export const getPostsByBlogIdHandler = async (
  req: RequestWithParams<{ id: string }> & RequestWithQuery<PostsQueryInput>,
  res: Response<PostListPaginatedOutput>,
) => {
  try {
    const sanitizedQuery = matchedData<Partial<PostsQueryInput>>(req, {
      locations: ['query'],
      includeOptionals: true,
    });
    const queryInput =
      setDefaultSortAndPaginationIfNotExist<PostsQueryInput['sortBy']>(sanitizedQuery);

    const blogId = req.params.id;
    // проверка существования блога
    const blog = await blogsService.findById(blogId);

    if (!blog) {
      return errorsHandler(new Error('Blog not found'), res);
    }

    const { items, totalCount } = await postsService.findMany(queryInput, blogId);

    const output = mapToPostListPaginatedOutput(
      items, 
      queryInput.pageNumber,
      queryInput.pageSize,
      totalCount,
    );

    return res.status(HTTP_STATUSES.OK_200).json(output);
  } catch (error) {
    console.error('Get posts by blog ID failed:', error);

    return errorsHandler(error, res);
  }
};
