import { Blog } from '../../features/blogs/types/blog.type';
import { BlogViewModelDto } from '../../features/blogs/dto/blogs.view-model.dto';
import { Post } from '../../features/posts/types/post.type';
import { PostViewModelDto } from '../../features/posts/dto/posts.view-model.dto';

export const mapBlog = (dbBlog: Blog): BlogViewModelDto => {
  return {
    id: dbBlog.id,
    name: dbBlog.name,
    description: dbBlog.description,
    websiteUrl: dbBlog.websiteUrl,
  };
};

export const mapPost = (dbPost: Post): PostViewModelDto => {
  return {
    id: dbPost.id,
    title: dbPost.title,
    shortDescription: dbPost.shortDescription,
    content: dbPost.content,
    blogId: dbPost.blogId,
    blogName: dbPost.blogName,
  };
};