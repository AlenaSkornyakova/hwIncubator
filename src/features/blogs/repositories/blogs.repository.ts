import { Blog } from  "../types/blog.type";
import { db } from  "../../../db/in-memory.db";
import { BlogInputModelDto } from "../dto/blogs.input-model.dto"; 


export const blogsRepository = {
  findAll(): Blog[] {
    return db.blogs;
  },

  findById(id: string): Blog | null {
    return db.blogs.find((b) => b.id === id) ?? null;
  },

  create(newBlog: Blog): Blog {
    db.blogs.push(newBlog);

    return newBlog;
  },

  update(id: string, dto: BlogInputModelDto): boolean {
    const blog = db.blogs.find((b) => b.id === id);

    if (!blog) {
      return false;
    }

    blog.name = dto.name;
    blog.description = dto.description
    blog.websiteUrl = dto.websiteUrl



    return true;
  },

  delete(id: string): boolean {
    const index = db.blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      return false;
    }

    db.blogs.splice(index, 1);
    return true;
  },
};
