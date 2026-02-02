import request from 'supertest';
import { app } from '../../src/set-app';
import { HTTP_STATUSES, HttpStatusType } from '../../src/core/utils/http-status';
import { routerPath } from '../../src/core/paths/paths';
import { BlogInputModelDto } from '../../src/features/blogs/dto/blogs.input-model.dto';
import { PostInputModelDto } from '../../src/features/posts/dto/posts.input-model.dto';
import { generateBasicAuthHeader } from './generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../config/admin-credentials';

const ADMIN_AUTH = generateBasicAuthHeader(
  TEST_ADMIN_USERNAME,
  TEST_ADMIN_PASSWORD,
);

export const blogTestManager = {
  async createBlog(
    data: BlogInputModelDto,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
  ) {
    const response = await request(app)
      .post(`${routerPath.blogs}`)
      .set('Authorization', ADMIN_AUTH)
      .send(data)
      .expect(expectedStatusCode);

    let createdEntity;

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = response.body;

      expect(createdEntity).toEqual({
        id: expect.any(String),
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
      });
    }
    return { response, createdEntity };
  },
};

export const postTestManager = {
  async createPost(
    data: PostInputModelDto,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
  ) {
    const response = await request(app)
      .post(`${routerPath.posts}`)
      .set('Authorization', ADMIN_AUTH)
      .send(data)
      .expect(expectedStatusCode);

    let createdEntity;

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = response.body;

      expect(createdEntity).toEqual({
        id: expect.any(String),
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: expect.any(String),
      });
    }
    return { response, createdEntity };
  },

  async createPostWithBlog(
    postBase: Omit<PostInputModelDto, 'blogId'>,
    blogData: BlogInputModelDto,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
  ) {
    const { createdEntity: blog } = await blogTestManager.createBlog(blogData);

    const postDto: PostInputModelDto = {
      ...postBase,
      blogId: blog.id,
    };

    const { response, createdEntity: post } = await this.createPost(postDto, expectedStatusCode);

    return { createdEntity: post, response };
  },
};
