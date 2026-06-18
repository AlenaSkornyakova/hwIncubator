import { Post } from '../domain/post.type';
import { WithId, ObjectId, Filter } from 'mongodb';
import { postCollection } from '../../../db/mongo.db';
import { PostsQueryInput } from '../api/input/posts-query-input';
import { PaginatedPostsDbResultDto } from './posts.paginated-db-result.dto';
import { SortDirection } from '../../../core/types/sort-direction.types';
import { RepositoryNotFoundError } from '../../../core/errors/repository-not-found.error';
import { PostCreateInput } from '../api/input/post-create.input';

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

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const result = await this.findById(id);
    if (!result) {
      throw new RepositoryNotFoundError('Post not exist');
    }
    return result;
  },
  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { _id: insertResult.insertedId, ...newPost };
  },

  async update(id: string, dto: PostCreateInput): Promise<void> {
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
    if(updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }
    return;
  },
};
