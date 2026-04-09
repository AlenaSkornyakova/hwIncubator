import request from 'supertest';
import { routerPath } from '../../../src/core/paths/paths';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { PostInputModelDto } from '../../../src/features/posts/dto/posts.input-model.dto';
import { postTestManager } from '../../utils/test-managers';
import { BlogInputModelDto } from '../../../src/features/blogs/dto/blogs.input-model.dto';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthHeader } from '../../utils/generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../../config/admin-credentials';
import { createTestApp } from '../../utils/createTestApp';
import { expectPostViewModel } from '../../utils/matchers';

describe('Post API CRUD', () => {
  const ADMIN_AUTH = generateBasicAuthHeader(TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD);

  const app = createTestApp();

  beforeEach(async () => {
    await clearDb(app);
  });

  const blogData: BlogInputModelDto = {
    name: 'Test Blog Name',
    description: 'Test description for Blog',
    websiteUrl: 'https://testblog.com',
  };
  const postBase: Omit<PostInputModelDto, 'blogId'> = {
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
    const { createdEntity } = await postTestManager.createPostWithBlog(app, postBase, blogData);
    expectPostViewModel(createdEntity, {
      title: postBase.title,
      shortDescription: postBase.shortDescription,
      content: postBase.content,
      blogId: createdEntity.blogId,
      blogName: blogData.name,
    });
    const list = await request(app).get(`${routerPath.posts}`).expect(HTTP_STATUSES.OK_200);
    expect(list.body.items).toHaveLength(1);
    expect(list.body.totalCount).toBe(1);
    expect(list.body.page).toBe(1);
    expect(list.body.pageSize).toBe(10);
    expect(list.body.pagesCount).toBe(1);

    expectPostViewModel(list.body.items[0], {
      title: postBase.title,
      shortDescription: postBase.shortDescription,
      content: postBase.content,
      blogId: createdEntity.blogId,
      blogName: createdEntity.blogName,
    });
  });

  it('GET /posts/:id should return entity by existing id', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(app, postBase, blogData);
    const response = await request(app)
      .get(`${routerPath.posts}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expectPostViewModel(response.body, {
      id: createdEntity.id,
      title: postBase.title,
      shortDescription: postBase.shortDescription,
      content: postBase.content,
      blogId: createdEntity.blogId,
      blogName: blogData.name,
    });
  });

  it('GET /posts/:id should return 404 for non-existing id', async () => {
    await request(app)
      .get(`${routerPath.posts}/aaaaaaaaaaaaaaaaaaaaaaaa`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('PUT /posts/:id should update the entity by id with correct input data', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(app, postBase, blogData);

    const updatedData: PostInputModelDto = {
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
    expectPostViewModel(response.body, {
      id: createdEntity.id,
      title: updatedData.title,
      shortDescription: updatedData.shortDescription,
      content: updatedData.content,
      blogId: updatedData.blogId,
      blogName: blogData.name,
    });
  });

  it('DELETE /posts/:id should delete the entity by id', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(app, postBase, blogData);
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
