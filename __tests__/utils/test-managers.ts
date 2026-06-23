import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from '../../src/core/utils/http-status';
import { routerPath } from '../../src/core/paths/paths';
import { BlogCreateInput } from '../../src/features/blogs/api/input/blog-crete.input';
import { PostCreateInput } from '../../src/features/posts/api/input/post-create.input';
import { generateBasicAuthHeader } from './generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../config/admin-credentials';

const ADMIN_AUTH = generateBasicAuthHeader(TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD);

export const blogTestManager = {
  async createBlog(
    app: any,
    blogData: BlogCreateInput,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
  ) {
    const response = await request(app)
      .post(`${routerPath.blogs}`)
      .set('Authorization', ADMIN_AUTH)
      .send(blogData)
      .expect(expectedStatusCode);

    let createdEntity;

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = response.body;
    }
    return { response, createdEntity };
  },
};

export const postTestManager = {
  async createPost(
    app: any,
    data: PostCreateInput,
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
    }
    return { response, createdEntity }
  },

  async createPostWithBlog(
    app: any,
    postData: Omit<PostCreateInput, 'blogId'>,
    blogData: BlogCreateInput,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
  ) {
    const { createdEntity: blog } = await blogTestManager.createBlog(app, blogData);

    const postDto: PostCreateInput = {
          ...postData,
          blogId: blog.id,
    };

    const { response, createdEntity: post } = await this.createPost(
      app,
      postDto,
      expectedStatusCode,
    );

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
    }

    return { createdEntity: post, response };
  },
};

