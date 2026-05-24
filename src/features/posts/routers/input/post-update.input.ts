import { ResourceType } from '../../../../core/types/resource-type.types'; 
  
export type PostUpdateInput = {
  data: {
    id: string;
    type: ResourceType.Posts;
    attributes: {
      title: string;
      shortDescription: string;
      content: string;
      blogId: string;
    };
  };
};