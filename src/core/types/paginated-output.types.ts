export type PaginatedOutput<T> = {
  meta: {
    page: number;
    pageSize: number;
    pagesCount: number;
    totalCount: number;
  };
  data: T[];
};