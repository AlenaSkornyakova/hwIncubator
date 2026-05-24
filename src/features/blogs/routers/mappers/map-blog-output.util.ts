import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog.type';
import { ResourceType } from '../../../../core/types/resource-type.types';
import { BlogOutput } from '../output/blog.output';

export function mapToBlogOutput(blog: WithId<Blog>): BlogOutput {
  return {
    data: {
      type: ResourceType.Blogs,
      id: blog._id.toString(),
      attributes: {
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt.toISOString(),
        isMembership: blog.isMembership,
      },
    },
  };
}