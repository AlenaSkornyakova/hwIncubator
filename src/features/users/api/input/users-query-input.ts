import { PaginationAndSortingQuery } from '../../../../core/types/pagination-and-sorting.types';
import { UserSortBy } from './users-sort-fields';


export type UsersQueryInput = 
PaginationAndSortingQuery<UserSortBy> & {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};
