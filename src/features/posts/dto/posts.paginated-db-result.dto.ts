import { WithId } from 'mongodb';
import { Post } from '../routers/domain/post.type';

export type PaginatedPostsDbResultDto = {
  items: WithId<Post>[];
  totalCount: number;
};