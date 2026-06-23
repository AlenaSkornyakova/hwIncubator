import request from 'supertest';
import { routerPath } from '../../../src/core/paths/paths';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { PostCreateInput } from '../../../src/features/posts/api/input/post-create.input';
import { postTestManager } from '../../utils/test-managers';
import { BlogCreateInput } from '../../../src/features/blogs/api/input/blog-crete.input';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthHeader } from '../../utils/generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../../config/admin-credentials';
import { createTestApp } from '../../utils/createTestApp';
import { expectPostOutput } from '../../utils/matchers';
import { PostUpdateInput } from '../../../src/features/posts/api/input/post-update.input';
import { PostOutput } from '../../../src/features/posts/api/output/post.output';

describe('Post API CRUD', () => {
  const ADMIN_AUTH = generateBasicAuthHeader(TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD);

  const app = createTestApp();

  beforeEach(async () => {
    await clearDb(app);
  });

  const blogData: BlogCreateInput = {
    name: 'Test Blog Name',
    description: 'Test description for Blog',
    websiteUrl: 'https://testblog.com',
  };
  const postData: Omit<PostCreateInput, 'blogId'> = {
    title: 'Test Post Title',
    shortDescription: 'Test Post Short Description',
    content: 'Test Post Content',
  };

  it('GET /posts should return 200 and an empty array. The server is alive, the route is connected, and the contract is honored.', async () => {
    await request(app).get(routerPath.posts).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('POST /posts should create a new entity and return it', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(
      app,
      postData,
      blogData,
    );
    expectPostOutput(createdEntity, {
      id: createdEntity.id,
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: createdEntity.blogId,
      blogName: createdEntity.blogName,
      createdAt: createdEntity.createdAt,
    });
    const list = await request(app).get(`${routerPath.posts}`).expect(HTTP_STATUSES.OK_200);
    expect(list.body.items).toHaveLength(1);
    expect(list.body.totalCount).toBe(1);
    expect(list.body.page).toBe(1);
    expect(list.body.pageSize).toBe(10);
    expect(list.body.pagesCount).toBe(1);

    expectPostOutput(list.body.items[0], {
      id: createdEntity.id,             
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: createdEntity.blogId,
      blogName: createdEntity.blogName,
      createdAt: createdEntity.createdAt,
    });
  });

  it('GET /posts/:id should return entity by existing id', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(
      app,
      postData,
      blogData,
    );
    const response = await request(app)
      .get(`${routerPath.posts}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expectPostOutput(response.body, {
      id: createdEntity.id,
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: createdEntity.blogId,
      blogName: createdEntity.blogName,
      createdAt: createdEntity.createdAt,
    });
  });

  it('GET /posts/:id should return 404 for non-existing id', async () => {
    await request(app)
      .get(`${routerPath.posts}/aaaaaaaaaaaaaaaaaaaaaaaa`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('PUT /posts/:id should update the entity by id with correct input data', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(
      app,
      postData,
      blogData,
    );

    const updatedData: PostUpdateInput = {
          title: 'Updated' + createdEntity.title,
          shortDescription: 'Updated' + createdEntity.shortDescription,
          content: 'Updated' + createdEntity.content,
          blogId: createdEntity.blogId,
    };

    await request(app)
      .put(`${routerPath.posts}/${createdEntity.id}`)
      .set('Authorization', ADMIN_AUTH)
      .send(updatedData)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const response = await request(app)
      .get(`${routerPath.posts}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expectPostOutput(response.body, {
      id: createdEntity.id,
      title: updatedData.title,
      shortDescription: updatedData.shortDescription,
      content: updatedData.content,
      blogId: updatedData.blogId,
      blogName: createdEntity.blogName,
      createdAt: createdEntity.createdAt,
    });
  });

  it('DELETE /posts/:id should delete the entity by id', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(
      app,
      postData,
      blogData,
    );
    await request(app)
      .delete(`${routerPath.posts}/${createdEntity.id}`)
      .set('Authorization', ADMIN_AUTH)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(`${routerPath.posts}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
    const list = await request(app).get(routerPath.posts).expect(HTTP_STATUSES.OK_200);
    expect(list.body.items).toHaveLength(0);
    expect(list.body.totalCount).toBe(0);
    expect(list.body.page).toBe(1);
    expect(list.body.pageSize).toBe(10);
    expect(list.body.pagesCount).toBe(0);
  });
});
