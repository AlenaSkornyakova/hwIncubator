import { SortDirection } from "../../../core/types/sort-direction";
import { PostSortBy } from "../types/posts-sort-fields";

export type PostsQueryInputModelDto = {
  pageNumber?: string;
  pageSize?: string;
  searchNameTerm?: string;
  sortBy?: PostSortBy;
  sortDirection?: SortDirection;
};