import { BlogSortBy } from "../types/blog-sort-fields";
import { SortDirection } from "../../../core/types/sort-direction.types";

export type BlogsQueryInputModelDto = {
  pageNumber?: string;
  pageSize?: string;
  searchNameTerm?: string;
  sortBy?: BlogSortBy;
  sortDirection?: SortDirection;
};