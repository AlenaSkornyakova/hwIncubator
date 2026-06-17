import { WithId } from 'mongodb';
import { Post } from '../domain/post.type';
import { PostOutput } from '../output/post.output';

export const mapToPostOutput = (dbPost: WithId<Post>): PostOutput => {
  return {
    id: dbPost._id.toString(),
    title: dbPost.title,
    shortDescription: dbPost.shortDescription,
    content: dbPost.content,
    blogId: dbPost.blogId,
    blogName: dbPost.blogName,
    createdAt: dbPost.createdAt.toISOString(),
  };
};
