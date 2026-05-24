import { SortDirection } from './sort-direction.types';
export type PaginationAndSortingQuery<TSortBy> = {
  pageNumber: number;
  pageSize: number;
  sortBy: TSortBy;
  sortDirection: SortDirection;
};