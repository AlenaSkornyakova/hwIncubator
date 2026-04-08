
import { SortDirection} from '../../../core/types/sort-direction';
import { BlogSortBy } from './blog-sort-fields';


export type BlogsQueryInput = {
  pageNumber: number;
  pageSize: number;
  sortBy: BlogSortBy;
  sortDirection: SortDirection;
  searchNameTerm: string;
};