import { BlogCreateInput } from '../api/input/blog-crete.input';
import { blogsRepository } from '../infrastructure/blogs-db.repository';
import { WithId } from 'mongodb';
import { Blog } from '../domain/blog.type';
import { PaginatedBlogsDbResultDto } from '../infrastructure/blogs.paginated-db-result.dto';
import { BlogsQueryInput } from '../api/input/blogs-query-input';
import { BlogUpdateInput } from '../api/input/blog-update.input';


export const blogsService = {
  async findMany(queryInput: BlogsQueryInput): Promise<PaginatedBlogsDbResultDto> {
    return await blogsRepository.findMany(queryInput);
  },

  async findById(id: string): Promise<WithId<Blog> | null> {
    return await blogsRepository.findById(id);
  },
  
  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return await blogsRepository.findByIdOrFail(id);
  },

  async create(dto: BlogCreateInput): Promise<WithId<Blog>> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
    };
    return await blogsRepository.create(newBlog);
  },

  async updateById(id: string, dto: BlogUpdateInput): Promise<void> {
    return await blogsRepository.updateById(id, dto);
  },

  async deleteById(id: string): Promise<void> {
    return await blogsRepository.deleteById(id);
  },
};
