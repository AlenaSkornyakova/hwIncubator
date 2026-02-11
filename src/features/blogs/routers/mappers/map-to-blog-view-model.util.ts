import { Blog } from '../../types/blog.type';
import { BlogViewModelDto } from '../../dto/blogs.view-model.dto';
import { WithId } from 'mongodb';


export const mapBlog = (dbBlog: WithId<Blog>): BlogViewModelDto => {
  return {
    id: dbBlog._id.toString(),
    name: dbBlog.name,
    description: dbBlog.description,
    websiteUrl: dbBlog.websiteUrl,
    isMembership: dbBlog.isMembership,
    createdAt: dbBlog.createdAt.toISOString()
  };
};


