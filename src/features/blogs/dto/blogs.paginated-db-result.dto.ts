import { WithId } from 'mongodb';
import { Blog } from '../types/blog.type';


export type PaginatedBlogsDbResultDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: WithId<Blog>[];
};