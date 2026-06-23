import { WithId } from 'mongodb';
import { Post } from '../../domain/post.type';
import { PostListPaginatedOutput } from '../output/post-list-paginated.output';
import { mapToPostOutput } from './map-post-output.util';

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
    items: posts.map(mapToPostOutput),
  };
}
