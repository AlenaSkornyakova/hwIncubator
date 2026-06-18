import { WithId } from 'mongodb';
import { Post } from '../../domain/post.type';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import { PostOutput } from '../output/post.output';

export function mapToPostListPaginatedOutput(
  posts: WithId<Post>[],
  pageNumber: number,
  pageSize: number,
  totalCount: number,
): PostListPaginatedOutput {
  return {
    page: pageNumber,
    pageSize: pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount: totalCount,
    items: posts.map(
      (post): PostOutput => ({
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString(),
      }),
    ),
  };
}
