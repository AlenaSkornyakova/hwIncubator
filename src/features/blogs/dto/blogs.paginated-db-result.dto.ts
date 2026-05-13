import { WithId } from 'mongodb';
import { Blog } from '../domain/blog.type';

export type PaginatedBlogsDbResultDto = {
  items: WithId<Blog>[];
  totalCount: number;
};