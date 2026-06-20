import { PaginationAndSortingQuery } from '../../../../core/types/pagination-and-sorting.types';
import { PostSortBy } from './posts-sort-fields';

export type PostsQueryInput =
  PaginationAndSortingQuery<PostSortBy>;