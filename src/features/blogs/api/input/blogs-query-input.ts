
import { PaginationAndSortingQuery } from '../../../../core/types/pagination-and-sorting.types';
import { BlogSortBy } from './blog-sort-fields';

export type BlogsQueryInput = PaginationAndSortingQuery<BlogSortBy> & {
  searchNameTerm?: string;
};