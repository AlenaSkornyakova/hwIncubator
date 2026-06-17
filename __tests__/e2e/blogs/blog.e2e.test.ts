import request from 'supertest';
import { routerPath } from '../../../src/core/paths/paths';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { BlogCreateInput } from '../../../src/features/blogs/routers/input/blog-crete.input';
import { blogTestManager } from '../../utils/test-managers';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthHeader } from '../../utils/generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../../config/admin-credentials';
import { createTestApp } from '../../utils/createTestApp';
import { expectBlogOutput } from '../../utils/matchers';
import { BlogUpdateInput } from '../../../src/features/blogs/routers/input/blog-update.input';

describe('Blog API CRUD', () => {
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

  it('GET /blogs should return 200 and an empty array. The server is alive, the route is connected, and the contract is honored.', async () => {
    await request(app).get(routerPath.blogs).expect(HTTP_STATUSES.OK_200, {
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('POST /blogs should create a new entity with correct input data and return it', async () => {
    const { createdEntity } = await blogTestManager.createBlog(app, blogData);
    expectBlogOutput(createdEntity, {
      id: createdEntity.id,
      name: blogData.name,
      description: blogData.description,
      websiteUrl: blogData.websiteUrl,
      isMembership: false,
      createdAt: createdEntity.createdAt,
    });
    const list = await request(app).get(`${routerPath.blogs}`).expect(HTTP_STATUSES.OK_200);
    expect(list.body.items).toHaveLength(1);
    expect(list.body.totalCount).toBe(1);
    expect(list.body.page).toBe(1);
    expect(list.body.pageSize).toBe(10);
    expect(list.body.pagesCount).toBe(1);
    expectBlogOutput(list.body.items[0], {
      id: list.body.items[0].id,
      name: blogData.name,
      description: blogData.description,
      websiteUrl: blogData.websiteUrl,
      isMembership: false,
      createdAt: list.body.items[0].createdAt,
    });
  });

  it('GET /blogs should return 200 and an array of existing entities', async () => {
    await blogTestManager.createBlog(app, blogData);
    const response = await request(app).get(`${routerPath.blogs}`).expect(HTTP_STATUSES.OK_200);

    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items).toHaveLength(1);
    expectBlogOutput(response.body.items[0], {
      id: response.body.items[0].id,
      name: blogData.name,
      description: blogData.description,
      websiteUrl: blogData.websiteUrl,
      isMembership: false,
      createdAt: response.body.items[0].createdAt,
    });
  });

  it('GET /blogs/:id should return entity by existing id', async () => {
    const { createdEntity } = await blogTestManager.createBlog(app, blogData);

    const response = await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expectBlogOutput(response.body, {
      id: createdEntity.id,
      name: blogData.name,
      description: blogData.description,
      websiteUrl: blogData.websiteUrl,
      isMembership: false,
      createdAt: createdEntity.createdAt,
    });
  });

  it('GET /blogs/:id should return 404 for non-existing id', async () => {
    await request(app)
      .get(`${routerPath.blogs}/aaaaaaaaaaaaaaaaaaaaaaaa`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('PUT /blogs/:id should update the entity by id with correct input data', async () => {
    const { createdEntity } = await blogTestManager.createBlog(app, blogData);
    const updatedData: BlogUpdateInput = {
      name: 'Updated Name',
      description: 'Updated Test Blog description',
      websiteUrl: 'https://updatedtestblog.com',
    };
    await request(app)
      .put(`${routerPath.blogs}/${createdEntity.id}`)
      .set('Authorization', ADMIN_AUTH)
      .send(updatedData)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const response = await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expectBlogOutput(response.body, {
      id: createdEntity.id,
      name: updatedData.name,
      description: updatedData.description,
      websiteUrl: updatedData.websiteUrl,
      isMembership: false,
      createdAt: createdEntity.createdAt,
    });
  });

  it('DELETE /blogs/:id  should delete the entity by id', async () => {
    const { createdEntity } = await blogTestManager.createBlog(app, blogData);

    await request(app)
      .delete(`${routerPath.blogs}/${createdEntity.id}`)
      .set('Authorization', ADMIN_AUTH)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
    const list = await request(app).get(routerPath.blogs).expect(HTTP_STATUSES.OK_200);
    expect(list.body.items).toHaveLength(0);
    expect(list.body.totalCount).toBe(0);
    expect(list.body.page).toBe(1);
    expect(list.body.pageSize).toBe(10);
    expect(list.body.pagesCount).toBe(0);
  });
});
