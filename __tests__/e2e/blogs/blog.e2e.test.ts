import request from 'supertest';
import { app } from '../../../src/set-app';
import { routerPath } from '../../../src/core/paths/paths';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { BlogInputModelDto } from '../../../src/features/blogs/dto/blogs.input-model.dto';
import { blogTestManager } from '../../utils/test-managers';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthHeader } from '../../utils/generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../../config/admin-credentials';

describe('Blog API CRUD', () => {

  const ADMIN_AUTH = generateBasicAuthHeader(
    TEST_ADMIN_USERNAME,
    TEST_ADMIN_PASSWORD,
  );

  beforeEach(async () => {
     await clearDb(app);
  });
  afterEach(async () => {
     await clearDb(app);
  });

  const blogData: BlogInputModelDto = {
    name: 'Test Blog Name',
    description: 'Test description for Blog',
    websiteUrl: 'https://testblog.com',
  };
  it('GET /blogs should return 200 and an empty array. The server is alive, the route is connected, and the contract is honored.', async () => {
    await request(app).get(routerPath.blogs).expect(HTTP_STATUSES.OK_200, []);
  });

  it('GET /blogs should return 200 and an array of existing entities', async () => {
    const { createdEntity } = await blogTestManager.createBlog(blogData);
    await request(app).get(`${routerPath.blogs}`).expect(HTTP_STATUSES.OK_200, [createdEntity]);
  });
  
  it('POST /blogs should create a new entity with correct input data and return it', async () => {
    const { createdEntity } = await blogTestManager.createBlog(blogData);
    await request(app).get(`${routerPath.blogs}`).expect(HTTP_STATUSES.OK_200, [createdEntity]);
  });

  it('GET /blogs/:id should return entity by existing id', async () => {
    const { createdEntity } = await blogTestManager.createBlog(blogData);
    const response = await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expect(response.body).toEqual(createdEntity);
  });

  it('GET /blogs/:id should return 404 for non-existing id', async () => {
    await request(app).get(`${routerPath.blogs}/9999`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('PUT /blogs/:id should update the entity by id with correct input data', async () => {
    const updatedData: BlogInputModelDto = {
      name: 'Updated Name',
      description: 'Updated Test Blog description',
      websiteUrl: 'https://updatedtestblog.com',
    };
    const { createdEntity } = await blogTestManager.createBlog(blogData);

    await request(app)
      .put(`${routerPath.blogs}/${createdEntity.id}`)
      .set('Authorization', ADMIN_AUTH)
      .send(updatedData)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdEntity,
        ...updatedData,
      });
  });

  it('should delete the entity by id', async () => {
    const { createdEntity } = await blogTestManager.createBlog(blogData);
    await request(app)
      .delete(`${routerPath.blogs}/${createdEntity.id}`)
      .set('Authorization', ADMIN_AUTH)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
