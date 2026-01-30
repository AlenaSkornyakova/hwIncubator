import { Blog } from '../types/blog.type';
import { db } from '../../../db/in-memory.db';
import { BlogInputModelDto } from '../dto/blogs.input-model.dto';

export const blogsRepository = {
  async findAll(): Promise<Blog[]> {
    return db.blogs;
  },

  async findById(id: string): Promise<Blog | null> {
    return db.blogs.find((b) => b.id === id) ?? null;
  },

  async create(newBlog: Blog): Promise<Blog> {
    db.blogs.push(newBlog);
    return newBlog;
  },

  async update(id: string, dto: BlogInputModelDto): Promise<boolean> {
    const blog = db.blogs.find((b) => b.id === id);
    if (!blog) return false;

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return true;
  },

  async delete(id: string): Promise<boolean> {
    const index = db.blogs.findIndex((b) => b.id === id);
    if (index === -1) return false;

    db.blogs.splice(index, 1);
    return true;
  },
};
