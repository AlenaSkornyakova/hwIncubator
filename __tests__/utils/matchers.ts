import { ResourceType } from '../../src/core/types/resource-type.types';
import { BlogDataOutput } from '../../src/features/blogs/routers/output/blog-data.output';
import { PostDataOutput } from '../../src/features/posts/routers/output/post-data.output';

const expectMongoObjectId = (id: string) => {
  expect(id).toMatch(/^[a-f\d]{24}$/i);
};

const expectValidDateString = (value: string) => {
  expect(new Date(value).toString()).not.toBe('Invalid Date');
};

export const expectBlogOutput = (
  blog: BlogDataOutput,
  expected: {
    id?: string;
    name: string;
    description: string;
    websiteUrl: string;
  },
) => {
  expect(blog).toEqual(
    expect.objectContaining({
      type: ResourceType.Blogs,
      id: expected.id ?? expect.any(String),
      attributes: expect.objectContaining({
        name: expected.name,
        description: expected.description,
        websiteUrl: expected.websiteUrl,
        isMembership: false,
        createdAt: expect.any(String),
      }),
    }),
  );

  expectMongoObjectId(blog.id);
  expectValidDateString(blog.attributes.createdAt);
};

export const expectPostOutput = (
  post: PostDataOutput,
  expected: {
    id?: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
    createdAt?: string;
  },
) => {
  expect(post).toEqual(
    expect.objectContaining({
      type: ResourceType.Posts,
      id: expected.id ?? expect.any(String),
      attributes: expect.objectContaining({
        title: expected.title,
        shortDescription: expected.shortDescription,
        content: expected.content,
        createdAt: expect.any(String),
        blogId: expected.blogId,
        blogName: expected.blogName === undefined ? expect.any(String) : expected.blogName,
      }),
    }),
  );

  expectMongoObjectId(post.id);
  expectMongoObjectId(post.attributes.blogId);
  expectValidDateString(post.attributes.createdAt);
};
