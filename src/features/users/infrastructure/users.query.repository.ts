import { ObjectId, WithId } from 'mongodb';
import { UserOutput } from '../api/output/user.output';
import { userCollection } from '../../../db/mongo.db';
import { mapToUserOutput } from './mappers/map-user-output.util';
import { UsersQueryInput } from '../api/input/users-query-input';
import { UsersListPaginatedOutput } from '../api/output/users-list-paginated.output';
import { Filter } from 'mongodb';
import { User } from '../domain/user.type';

export const usersQueryRepository = {
  async findById(id: string): Promise<UserOutput | null> {
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    return user ? mapToUserOutput(user) : null;
  },

  async findMany(
    query: UsersQueryInput,
  ): Promise<UsersListPaginatedOutput> {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Filter<User> = {};

    if (query.searchLoginTerm) {
      filter.login = { $regex: query.searchLoginTerm, $options: 'i' };
    }
    if (query.searchEmailTerm) {
      filter.email = { $regex: query.searchEmailTerm, $options: 'i' };
    }
  
    const sortField = sortBy === 'id' ? '_id' : sortBy;
    const items = await userCollection
      .find(filter)
      .sort({ [sortField]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await userCollection.countDocuments(filter);

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount,
      items: items.map(mapToUserOutput),
    };
  },
};
