import { Post } from '../types/post.type';
import { PostInputModelDto } from '../dto/posts.input-model.dto';
import { WithId, ObjectId, Filter } from 'mongodb';
import { postCollection } from '../../../db/mongo.db';
import { PostsQueryInput } from '../types/posts-query-input';
import { PaginatedPostsDbResultDto } from '../dto/posts.paginated-db-result.dto';

export const postsRepository = {
  async findMany(
    normalizedQuery: PostsQueryInput,
    blogId?: string,
  ): Promise<PaginatedPostsDbResultDto> {
    const filter: Filter<Post> = {};
    if (blogId) {
      filter.blogId = blogId;
    }
    const skip = (normalizedQuery.pageNumber - 1) * normalizedQuery.pageSize;
    const sortField = normalizedQuery.sortBy === 'id'
  ? '_id'
  : normalizedQuery.sortBy;

    const items = await postCollection
      .find(filter)
      .sort({ [sortField]: normalizedQuery.sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(normalizedQuery.pageSize)
      .toArray();
    const totalCount = await postCollection.countDocuments(filter);
    return {
      pagesCount: Math.ceil(totalCount / normalizedQuery.pageSize),
      page: normalizedQuery.pageNumber,
      pageSize: normalizedQuery.pageSize,
      totalCount: totalCount,
      items: items,
    };
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    if (!ObjectId.isValid(id)) return null;
    return postCollection.findOne({ _id: new ObjectId(id) });
  },
  async findByBlogId(blogId: string): Promise<WithId<Post>[]> {
    if (!ObjectId.isValid(blogId)) return [];
    return postCollection.find({ blogId: blogId }).toArray();
  },
  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { _id: insertResult.insertedId, ...newPost };
  },

  async update(id: string, dto: PostInputModelDto): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );
    return updateResult.matchedCount === 1;
  },

  async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const deleteResult = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount === 1;
  },
};
