import { BlogOutput } from '../../src/features/blogs/routers/output/blog.output';
import { PostOutput } from '../../src/features/posts/routers/output/post.output';

const expectMongoObjectId = (id: string) => {
  expect(id).toMatch(/^[a-f\d]{24}$/i);
};

const expectValidDateString = (value: string) => {
  expect(new Date(value).toString()).not.toBe('Invalid Date');
};

export const expectBlogOutput = (
  blog: BlogOutput,
  expected: BlogOutput
) => {
  expect(blog).toEqual(
    expect.objectContaining({
      id: expected.id,
      name: expected.name,
      description: expected.description,
      websiteUrl: expected.websiteUrl,
      isMembership: expected.isMembership,
      createdAt: expected.createdAt,
    }),
  );
  expectMongoObjectId(blog.id);
  expectValidDateString(blog.createdAt);
};

export const expectPostOutput = (
  post: PostOutput,
  expected: PostOutput
) => {
  expect(post).toEqual(
    expect.objectContaining({
      id: expected.id,
      title: expected.title,
      shortDescription: expected.shortDescription,
      content: expected.content,
      createdAt: expected.createdAt,
      blogId: expected.blogId,
      blogName: expected.blogName,
    }),
  );

  expectMongoObjectId(post.id);
  expectMongoObjectId(post.blogId);
  expectValidDateString(post.createdAt);
};
