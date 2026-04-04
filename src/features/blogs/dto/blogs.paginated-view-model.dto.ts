import { BlogViewModelDto } from './blogs.view-model.dto';

export type PaginatedBlogsViewModelDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogViewModelDto[];
};
