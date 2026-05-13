import type { Blog } from '../features/blogs/domain/blog.type';
import { Post } from '../features/posts/routers/domain/post.type';

export type DBType = {
  blogs: Blog[];
  posts: Post[];
};

export const db = {
  blogs: <Blog[]>[
    // {
    //   id: 'string',
    //   name: 'string',
    //   description: 'string',
    //   websiteUrl: 'string',
    // },
  ],
  posts: <Post[]>[
    // {
    //   id: 'string',
    //   title: 'string',
    //   shortDescription: 'string',
    //   content: 'string',
    //   blogId: 'string',
    //   blogName: 'string',
    // },
  ],
};
