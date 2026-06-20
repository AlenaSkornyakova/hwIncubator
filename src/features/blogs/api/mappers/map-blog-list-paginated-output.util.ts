import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog.type';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';
import { mapToBlogOutput } from './map-blog-output.util';

export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],
  pageNumber: number,
  pageSize: number,
  totalCount: number,
): BlogListPaginatedOutput {
  return {
    page: pageNumber,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,
    items: blogs.map(mapToBlogOutput),
  };
}
