import { ResourceType } from '../../../../core/types/resource-type.types';

export type BlogUpdateInput = {
  data: {
    id: string;
    type: ResourceType.Blogs;
    attributes: {
      name: string;
      description: string;
      websiteUrl: string;
    };
  };
};