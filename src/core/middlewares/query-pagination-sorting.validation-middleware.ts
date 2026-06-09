import { query } from 'express-validator';
import { SortDirection } from '../types/sort-direction.types';
import { sortDirections } from '../types/sort-direction.types';
import { PaginationAndSortingQuery } from '../types/pagination-and-sorting.types';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION: SortDirection = 'desc';
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: PaginationAndSortingQuery<string> = {
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export function paginationAndSortingValidation<T extends readonly string[]>(
  sortFields: T,
) {
  const allowedSortFields = [...sortFields];

  return [
    query('pageNumber')
      .default(DEFAULT_PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),

    query('pageSize')
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(),

    query('sortBy')
      .default(DEFAULT_SORT_BY)
      .isIn(allowedSortFields)
      .withMessage(
        `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`,
      ),

    query('sortDirection')
      .default(DEFAULT_SORT_DIRECTION)
        .isIn(sortDirections)
      .withMessage(
        `Sort direction must be one of: ${sortDirections.join(', ')}`,
      ),
  ];
}