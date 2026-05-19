import { PaginationAndSortingQuery } from '../types/pagination-and-sorting.types';
import { paginationAndSortingDefault } from '../middlewares/query-pagination-sorting.validation-middleware'; 

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: Partial<PaginationAndSortingQuery<P>>,
): PaginationAndSortingQuery<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ??
      paginationAndSortingDefault.sortBy) as P,
  };
}