import { PostCreateInput } from '../routers/input/post-create.input';
import { postsRepository } from '../repositories/posts-db.repository';
import { WithId } from 'mongodb';
import { Post } from '../routers/domain/post.type';
import { PaginatedPostsDbResultDto } from '../dto/posts.paginated-db-result.dto';
import { PostsQueryInput } from '../routers/input/posts-query-input';
import { blogsRepository } from '../../blogs/repositories/blogs-db.repository';
import { BlogNotFoundError } from './errors';
import { PostCreateDto } from '../dto/post-create.dto';



export const postsService = {
  async findMany(queryInput:PostsQueryInput, blogId?: string ): Promise<PaginatedPostsDbResultDto> {
    return await postsRepository.findMany(queryInput, blogId);
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return await postsRepository.findById(id);
  },

  async create(dto: PostCreateDto): Promise<WithId<Post>> {
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

  async updateById(id: string, dto: PostCreateDto): Promise<boolean> {
    return await postsRepository.update(id, dto);
  },

  async deleteById(id: string): Promise<boolean> {
    return await postsRepository.delete(id);
  },
};
