
import { Post } from '../../types/post.type';
import { PostViewModelDto } from '../../dto/posts.view-model.dto';  
import { WithId } from 'mongodb';


export const mapPost = (dbPost: WithId<Post>): PostViewModelDto => {
  return {
    id: dbPost._id.toString(),
    title: dbPost.title,
    shortDescription: dbPost.shortDescription,
    content: dbPost.content,
    blogId: dbPost.blogId,
    blogName: dbPost.blogName,
    createdAt: dbPost.createdAt.toISOString()
  };
};