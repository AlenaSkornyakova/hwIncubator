import { Post } from '../routers/domain/post.type';
import { PostCreateInput } from '../routers/input/post-create.input';
import { WithId, ObjectId, Filter } from 'mongodb';
import { postCollection } from '../../../db/mongo.db';
import { PostsQueryInput } from '../routers/input/posts-query-input';
import { PaginatedPostsDbResultDto } from '../dto/posts.paginated-db-result.dto';
import { SortDirection } from '../../../core/types/sort-direction.types';

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
    const sortField = normalizedQuery.sortBy === 'id' ? '_id' : normalizedQuery.sortBy;

    const items = await postCollection
      .find(filter)
      .sort({ [sortField]: normalizedQuery.sortDirection === SortDirection.Asc ? 1 : -1 })
      .skip(skip)
      .limit(normalizedQuery.pageSize)
      .toArray();
    const totalCount = await postCollection.countDocuments(filter);
    return {
      items,
      totalCount,
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

  async update(id: string, dto: PostCreateInput): Promise<boolean> {
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
