import { Post } from '../types/post.type';
import { db } from '../../../db/in-memory.db';
import { PostInputModelDto } from '../dto/posts.input-model.dto';

export const postsRepository = { 
  findAll(): Post[] {
    return db.posts;
  },

  findById(id: string): Post | null {
    return db.posts.find((p) => p.id === id) ?? null;
  },

  create(newPost: Post): Post {
    db.posts.push(newPost);

    return newPost;
  },

  update(id: string, dto: PostInputModelDto): boolean {
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

  delete(id: string): boolean {
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }

    db.posts.splice(index, 1);
    return true;
  },
};
