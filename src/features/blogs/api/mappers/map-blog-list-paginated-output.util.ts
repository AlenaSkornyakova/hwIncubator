import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog.type';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated-output';
import { BlogOutput } from '../output/blog.output';

export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],
    pageNumber: number,
    pageSize: number,
    totalCount: number
): BlogListPaginatedOutput {
  return {
      page: pageNumber,
      pageSize:  pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount: totalCount,
    items: blogs.map(
      (blog): BlogOutput => ({
        id: blog._id.toString(),
        name: blog.name,  
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt.toISOString(),
        isMembership: blog.isMembership,
      })
    ),
  };
}
