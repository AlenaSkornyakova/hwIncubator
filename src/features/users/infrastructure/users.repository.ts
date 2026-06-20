import { ObjectId, WithId } from 'mongodb';
import { User } from '../domain/user.type';
import { userCollection } from '../../../db/mongo.db';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';

export const usersRepository = {
  
  async create(user: User): Promise<string> {
    const newUser = await userCollection.insertOne({ ...user });
    if (!newUser.insertedId) {
      throw new Error('User was not inserted: insertedId is missing');
    }
    return newUser.insertedId.toString();
  },

  async findById(id: string): Promise<WithId<User> | null> {
    if (!ObjectId.isValid(id)) return null;
    return userCollection.findOne({ _id: new ObjectId(id) });
  },

  async findByIdOrFail(id: string): Promise<WithId<User>> {
    const user = await this.findById(id);
    if (!user) {
      throw new RepositoryNotFoundError('User not found');
    }
    return user;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount === 1;
  },

};
