import { BlogInputModelDto } from '../dto/blogs.input-model.dto';
import { blogCollection } from '../../../db/mongo.db';
import { Filter, ObjectId, WithId } from 'mongodb';
import { Blog } from '../types/blog.type';
import { PaginatedBlogsDbResultDto } from '../dto/blogs.paginated-db-result.dto';
import {BlogsQueryInput} from '../types/blogs-query-input';

export const blogsRepository = {

  async findMany(normalizedQuery: BlogsQueryInput
  ): Promise<PaginatedBlogsDbResultDto> {
  const skip = (normalizedQuery.pageNumber - 1) * normalizedQuery.pageSize;
  const filter: Filter<Blog> = {};
  if (normalizedQuery.searchNameTerm) {
    filter.name = { $regex: normalizedQuery.searchNameTerm, $options: 'i' };
  }
  const items = await blogCollection
    .find(filter)
    .sort({ [normalizedQuery.sortBy]: normalizedQuery.sortDirection === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(normalizedQuery.pageSize)
    .toArray();
  const totalCount = await blogCollection.countDocuments(filter);
  return {
    pagesCount: Math.ceil(totalCount / normalizedQuery.pageSize),
    page: normalizedQuery.pageNumber,
    pageSize: normalizedQuery.pageSize,
    totalCount: totalCount,
    items: items,
  };
},

  async findById(id: string): Promise<WithId<Blog> | null> {
    if (!ObjectId.isValid(id)) return null;
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return { _id: insertResult.insertedId, ...newBlog };
  },

  async updateById(id: string, dto: BlogInputModelDto): Promise<boolean> {
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
