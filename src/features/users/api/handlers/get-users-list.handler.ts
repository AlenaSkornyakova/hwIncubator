import { Response } from 'express';
import { matchedData } from 'express-validator/lib/matched-data';
import { HTTP_STATUSES } from '../../../../core/utils/http-status';
import { RequestWithQuery } from '../../../../core/types/request-types.types';
import { setDefaultSortAndPaginationIfNotExist } from '../../../../core/helpers/set-default-sort-and-pagination';
import { errorsHandler } from '../../../../core/errors/errors.handler';
import { UsersQueryInput } from '../input/users-query-input';
import { UsersListPaginatedOutput } from '../output/users-list-paginated.output';
import { usersQueryRepository } from '../../infrastructure/users.query.repository';

export const getUsersListHandler = async (
  req: RequestWithQuery<Partial<UsersQueryInput>>,
  res: Response<UsersListPaginatedOutput>,
) => {
  try {
    const sanitizedQuery = matchedData<Partial<UsersQueryInput>>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const dto: Partial<UsersQueryInput> = {
      pageNumber: sanitizedQuery.pageNumber,
      pageSize: sanitizedQuery.pageSize,
      sortBy: sanitizedQuery.sortBy,
      sortDirection: sanitizedQuery.sortDirection,
    };
    const queryInput: UsersQueryInput =
      setDefaultSortAndPaginationIfNotExist<UsersQueryInput['sortBy']>(dto);  

    const userListPaginatedOutput = await usersQueryRepository.findMany(queryInput);
    
    return res.status(HTTP_STATUSES.OK_200).json(userListPaginatedOutput);
  } catch (error) {
    console.error('Get users list failed:', error);
    return errorsHandler(error, res);
  }
};
