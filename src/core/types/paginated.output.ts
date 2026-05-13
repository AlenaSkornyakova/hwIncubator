export type PaginatedOutput<T> = {
  meta: {
    page: number;
    pageSize: number;
    pageCount: number;
    totalCount: number;
  };
  data: T[];
};