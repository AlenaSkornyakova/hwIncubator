import { SortDirection } from './sort-direction.types';
export type PaginationAndSortingQuery<TSortBy extends string> = {
  pageNumber: number;
  pageSize: number;
  sortBy: TSortBy;
  sortDirection: SortDirection;
};