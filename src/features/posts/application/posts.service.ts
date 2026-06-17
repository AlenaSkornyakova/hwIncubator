import { postsRepository } from '../repositories/posts-db.repository';
import { WithId } from 'mongodb';
import { Post } from '../routers/domain/post.type';
import { PaginatedPostsDbResultDto } from '../dto/posts.paginated-db-result.dto';
import { PostsQueryInput } from '../routers/input/posts-query-input';
import { blogsRepository } from '../../blogs/repositories/blogs-db.repository';
import { PostCreateDto } from '../dto/post-create.dto';
import { DomainError } from '../../../core/errors/domain.error';
import { PostCreateForBlogDto } from '../dto/post-create-for-blog.dto';
import { PostUpdateDto } from '../dto/post-update.dto';



export const postsService = {
  async findMany(queryInput:PostsQueryInput, blogId?: string ): Promise<PaginatedPostsDbResultDto> {
    return await postsRepository.findMany(queryInput, blogId);
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return await postsRepository.findById(id);
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    return await postsRepository.findByIdOrFail(id);
  },

  async create(dto: PostCreateDto): Promise<WithId<Post>> {
    const blog = await blogsRepository.findById(dto.blogId);
    if (!blog) {
    throw new DomainError(
      'blogId is invalid',
      'BLOG_NOT_FOUND',
      'blogId',
      400,
    );
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
  async createForBlog(
  blogId: string,
  dto: PostCreateForBlogDto,
): Promise<WithId<Post>> {
  const blog = await blogsRepository.findByIdOrFail(blogId);

  const newPost: Post = {
    title: dto.title,
    shortDescription: dto.shortDescription,
    content: dto.content,
    blogId,
    blogName: blog.name,
    createdAt: new Date(),
  };

  return postsRepository.create(newPost);
},

  async updateById(id: string, dto: PostUpdateDto): Promise<void> {
    return await postsRepository.update(id, dto);
  },

  async deleteById(id: string): Promise<void> {
    return await postsRepository.delete(id);
  },
};
