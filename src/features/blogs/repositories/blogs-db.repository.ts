import { BlogCreateInput,} from '../routers/input/blog-crete.input';
import { blogCollection } from '../../../db/mongo.db';
import { Filter, ObjectId, WithId } from 'mongodb';
import { Blog } from '../domain/blog.type';
import { PaginatedBlogsDbResultDto } from '../dto/blogs.paginated-db-result.dto';
import {BlogsQueryInput} from '../routers/input/blogs-query-input';
import { SortDirection } from '../../../core/types/sort-direction.types';
import { BlogCreateDto } from '../dto/blog-create.dto';

export const blogsRepository = {

  async findMany(normalizedQuery: BlogsQueryInput
  ): Promise<PaginatedBlogsDbResultDto> {
  const skip = (normalizedQuery.pageNumber - 1) * normalizedQuery.pageSize;
  const filter: Filter<Blog> = {};
  if (normalizedQuery.searchNameTerm) {
    filter.name = { $regex: normalizedQuery.searchNameTerm, $options: 'i' };
  }
  const sortField = normalizedQuery.sortBy === 'id'
  ? '_id'
  : normalizedQuery.sortBy;
  const items = await blogCollection
    .find(filter)
    .sort({ [sortField]: normalizedQuery.sortDirection === SortDirection.Asc ? 1 : -1 })
    .skip(skip)
    .limit(normalizedQuery.pageSize)
    .toArray();
  const totalCount = await blogCollection.countDocuments(filter);
  return {
  items,
  totalCount,
};
},

  async findById(id: string): Promise<WithId<Blog> | null> {
    if (!ObjectId.isValid(id)) return null;
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },
  
  // async findByIdOrFail(id: string): Promise<WithId<Blog>> {
  //   const res = await blogCollection.findOne({ _id: new ObjectId(id) });

  //   if (!res) {
  //     throw new RepositoryNotFoundError('Blog not exist');
  //   }
  //   return res;
  // },


  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return { _id: insertResult.insertedId, ...newBlog };
  },

  async updateById(id: string, dto:  BlogCreateDto): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;

    const updateResult = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );
    return updateResult.matchedCount === 1;
  },

  async deleteById(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const deleteResult = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount === 1;
  },
};
