import { ResourceType } from '../../../../core/types/resource-type.types';

export type PostDataOutput = {
  type: ResourceType.Posts;
  id: string;
  attributes: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
  };
};