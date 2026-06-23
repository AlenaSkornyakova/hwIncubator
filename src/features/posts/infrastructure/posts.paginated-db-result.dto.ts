import { WithId } from 'mongodb';
import { Post } from '../domain/post.type';

export type PaginatedPostsDbResultDto = {
  items: WithId<Post>[];
  totalCount: number;
};