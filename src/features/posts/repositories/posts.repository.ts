import { Post } from '../types/post.type';
import { db } from '../../../db/in-memory.db';
import { PostInputModelDto } from '../dto/posts.input-model.dto';

export const postsRepository = { 
  async findAll(): Promise<Post[]> {
    return db.posts;
  },

  async findById(id: string): Promise<Post | null> {
    return db.posts.find((p) => p.id === id) ?? null;
  },

  async create(newPost: Post): Promise<Post>   {
    db.posts.push(newPost);

    return newPost;
  },

  async update(id: string, dto: PostInputModelDto): Promise<boolean> {
    const post = db.posts.find((p) => p.id === id);

    if (!post) {
      return false;
    }

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

    return true;
  },

  async delete(id: string): Promise<boolean> {
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }

    db.posts.splice(index, 1);
    return true;
  },
};
