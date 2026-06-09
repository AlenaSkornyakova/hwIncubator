import { SortDirection} from '../../../core/types/sort-direction.types';   
import { PostSortBy } from './posts-sort-fields';

export type PostsQueryInput = {
  pageNumber: number;
  pageSize: number;
  sortBy: PostSortBy;
  sortDirection: SortDirection;
  searchTitleTerm?: string;
};