import { PostViewModelDto } from './posts.view-model.dto';

export type PaginatedPostsViewModelDto = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModelDto[];
};
