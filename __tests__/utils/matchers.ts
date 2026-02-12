
const expectMongoObjectId = (id: string) => {
  expect(id).toMatch(/^[a-f\d]{24}$/i);
};

const expectValidDateString = (value: string) => {
  expect(new Date(value).toString()).not.toBe('Invalid Date');
};

export const expectBlogViewModel = (
  blog: any,
  expected: {
    id?: string;
    name: string;
    description: string;
    websiteUrl: string;
  }
) => {
  expect(blog).toEqual(
    expect.objectContaining({
      id: expected.id ?? expect.any(String),
      name: expected.name,
      description: expected.description,
      websiteUrl: expected.websiteUrl,
      isMembership: false,
      createdAt: expect.any(String),
    }),
  );

  expectMongoObjectId(blog.id);
  expectValidDateString(blog.createdAt);
};

export const expectPostViewModel = (
  post: any,
  expected: {
    id?: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
  },
) => {
  expect(post).toEqual(
    expect.objectContaining({
      id: expected.id ?? expect.any(String),
      title: expected.title,
      shortDescription: expected.shortDescription,
      content: expected.content,
      createdAt: expect.any(String),
      blogId: expected.blogId,
      blogName: expected.blogName === undefined ? expect.any(String) : expected.blogName,
    }),
  );

  expectMongoObjectId(post.id);
  expectMongoObjectId(post.blogId);
  expectValidDateString(post.createdAt);
};

