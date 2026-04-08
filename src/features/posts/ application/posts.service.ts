import { PostInputModelDto } from '../dto/posts.input-model.dto';
import { postsRepository } from '../repositories/posts-db.repository';
import { WithId } from 'mongodb';
import { Post } from '../types/post.type';
import { PaginatedPostsDbResultDto } from '../dto/posts.paginated-db-result.dto';
import { PostsQueryInput } from '../types/posts-query-input';
import { blogsRepository } from '../../blogs/repositories/blogs-db.repository';
import { BlogNotFoundError } from './errors';



export const postsService = {
  async findMany(queryInput:PostsQueryInput ): Promise<PaginatedPostsDbResultDto> {
    return await postsRepository.findMany(queryInput);
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return await postsRepository.findById(id);
  },

  async create(dto: PostInputModelDto): Promise<WithId<Post>> {
    const blog = await blogsRepository.findById(dto.blogId);
    if (!blog) {
    throw new BlogNotFoundError();
  }
     const newPost: Post = { 
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };
    return await postsRepository.create(newPost);

  },

  async updateById(id: string, dto: PostInputModelDto): Promise<boolean> {
    return await postsRepository.update(id, dto);
  },

  async deleteById(id: string): Promise<boolean> {
    return await postsRepository.delete(id);
  },
};
