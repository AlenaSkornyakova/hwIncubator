import { SortDirection } from "../../../core/types/sort-direction.types";
import { PostSortBy } from "../types/posts-sort-fields";

export type PostsQueryInputModelDto = {
  pageNumber?: string;
  pageSize?: string;
  searchNameTerm?: string;
  sortBy?: PostSortBy;
  sortDirection?: SortDirection;
};