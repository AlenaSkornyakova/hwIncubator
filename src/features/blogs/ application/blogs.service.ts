import { BlogCreateInput } from '../routers/input/blog-crete.input';
import { blogsRepository } from '../repositories/blogs-db.repository';
import { WithId } from 'mongodb';
import { Blog } from '../domain/blog.type';
import { PaginatedBlogsDbResultDto } from '../dto/blogs.paginated-db-result.dto';
import { BlogsQueryInput } from '../routers/input/blogs-query-input';
import { BlogCreateDto } from '../dto/blog-create.dto';
import { BlogUpdateDto } from '../dto/blog-update.dto';

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

  async create(dto: BlogCreateDto): Promise<WithId<Blog>> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
    };
    return await blogsRepository.create(newBlog);
  },

  async updateById(id: string, dto: BlogUpdateDto): Promise<void> {
    return await blogsRepository.updateById(id, dto);
  },

  async deleteById(id: string): Promise<void> {
    return await blogsRepository.deleteById(id);
  },
};
