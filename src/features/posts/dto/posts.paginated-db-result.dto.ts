import { WithId } from 'mongodb';
import { Post } from '../routers/domain/post.type';


export type PaginatedPostsDbResultDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: WithId<Post>[];
};