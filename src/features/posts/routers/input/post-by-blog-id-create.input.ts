import { ResourceType } from '../../../../core/types/resource-type.types';

export type PostByBlogIdCreateInput = {
  data: {
    type: ResourceType.Posts;
    attributes: {
      title: string;
      shortDescription: string;
      content: string;
    };
  };
};