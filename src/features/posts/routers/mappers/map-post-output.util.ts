import { WithId } from 'mongodb';
import { Post } from '../domain/post.type';
import { PostOutput } from '../output/post.output';
import { ResourceType } from '../../../../core/types/resource-type.types';

export const mapToPostOutput = (
  dbPost: WithId<Post>,
): PostOutput => {
  return {
    data: {
      type: ResourceType.Posts,
      id: dbPost._id.toString(),
      attributes: {
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        content: dbPost.content,
        blogId: dbPost.blogId,
        blogName: dbPost.blogName,
        createdAt: dbPost.createdAt.toISOString(),
      },
    },
  };
};