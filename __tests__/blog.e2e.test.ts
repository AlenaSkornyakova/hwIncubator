import request from 'supertest';
import { app } from '../src/set-app';
import { routerPath } from '../src/core/paths/paths';
import { HTTP_STATUSES } from '../src/core/utils/http-status';
import { BlogInputModelDto } from '../src/features/blogs/dto/blogs.input-model.dto';
import { blogTestManager } from '../src/core/utils/test-managers';


describe('Blog API', () => {
  beforeEach(async () => {
    await request(app).delete(`${routerPath.testing}/all-data`);
  });
  afterEach(async () => {
    await request(app).delete(`${routerPath.testing}/all-data`);
  });

  const createdData: BlogInputModelDto = {
    name: 'Test name for Blog',
    description: 'Test description for Blog',
    websiteUrl: 'https://testblog.com',
  };
  it('should return 200 and an empty array. The server is alive, the route is connected, and the contract is honored.', async () => {
    await request(app).get(routerPath.blogs).expect(HTTP_STATUSES.OK_200, []);
  });

  it('should create a new entity with correct input data and return it', async () => {
    const { createdEntity } = await blogTestManager.createBlog(createdData);
    await request(app).get(`${routerPath.blogs}`).expect(HTTP_STATUSES.OK_200, [createdEntity]);
  });

  it("shouldn't create a new entity with incorrect input data and return status 400", async () => {
    const invalidData = {
      name: 'Only name provided',
    };
    await blogTestManager.createBlog(invalidData as any, HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('should return entity by existing id', async () => {
    const { createdEntity } = await blogTestManager.createBlog(createdData);
    const response = await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expect(response.body).toEqual(createdEntity);
  });

  it('should return 404 for non-existing id', async () => {
    await request(app).get(`${routerPath.blogs}/9999`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('should update the entity by id with correct input data', async () => {
    const updatedData: BlogInputModelDto = {
      name: 'Updated Test Blog name',
      description: 'Updated Test Blog description',
      websiteUrl: 'https://updatedtestblog.com',

    };
    const { createdEntity } = await blogTestManager.createBlog(createdData);

    await request(app)
      .put(`${routerPath.blogs}/${createdEntity.id}`)
      .send(updatedData)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdEntity,
        ...updatedData,
      });
  });


  it("shouldn't update the entity by id with incorrect input data", async () => {
    const { createdEntity } = await blogTestManager.createBlog(createdData);
    const invalidData : BlogInputModelDto = {
      name: '',
      description: '',
      websiteUrl: '',
    };
    await request(app)
      .put(`${routerPath.blogs}/${createdEntity.id}`)
      .send(invalidData)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('should delete the entity by id', async () => {
    const { createdEntity } = await blogTestManager.createBlog(createdData);
    await request(app).delete(`${routerPath.blogs}/${createdEntity.id}`).expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app).get(`${routerPath.blogs}/${createdEntity.id}`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
