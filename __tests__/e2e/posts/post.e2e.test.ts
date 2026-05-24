import request from 'supertest';
import { routerPath } from '../../../src/core/paths/paths';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { PostCreateInput } from '../../../src/features/posts/routers/input/post-create.input';
import { postTestManager } from '../../utils/test-managers';
import { BlogCreateInput } from '../../../src/features/blogs/routers/input/blog-crete.input';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthHeader } from '../../utils/generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../../config/admin-credentials';
import { createTestApp } from '../../utils/createTestApp';
import { expectPostOutput } from '../../utils/matchers';
import { ResourceType } from '../../../src/core/types/resource-type.types';
import { PostUpdateInput } from '../../../src/features/posts/routers/input/post-update.input';

describe('Post API CRUD', () => {
  const ADMIN_AUTH = generateBasicAuthHeader(TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD);

  const app = createTestApp();

  beforeEach(async () => {
    await clearDb(app);
  });

  const blogData: BlogCreateInput = {
    data: {
      type: ResourceType.Blogs,
      attributes: {
        name: 'Test Blog Name',
        description: 'Test description for Blog',
        websiteUrl: 'https://testblog.com',
      },
    },
  };
  const postAttributes: Omit<PostCreateInput['data']['attributes'], 'blogId'> = {
    title: 'Test Post Title',
    shortDescription: 'Test Post Short Description',
    content: 'Test Post Content',
  };

  it('GET /posts should return 200 and an empty array. The server is alive, the route is connected, and the contract is honored.', async () => {
    await request(app)
      .get(routerPath.posts)
      .expect(HTTP_STATUSES.OK_200, {
        meta: {
          page: 1,
          pageSize: 10,
          pagesCount: 0,
          totalCount: 0,
        },
        data: [],
      });
  });

  it('POST /posts should create a new entity and return it', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(
      app,
      postAttributes,
      blogData,
    );
    expectPostOutput(createdEntity.data, {
      id: createdEntity.id,
      title: postAttributes.title,
      shortDescription: postAttributes.shortDescription,
      content: postAttributes.content,
      blogId: createdEntity.data.attributes.blogId,
      blogName: createdEntity.data.attributes.blogName,
      createdAt: createdEntity.data.attributes.createdAt,
    });
    const list = await request(app).get(`${routerPath.posts}`).expect(HTTP_STATUSES.OK_200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.meta.totalCount).toBe(1);
    expect(list.body.meta.page).toBe(1);
    expect(list.body.meta.pageSize).toBe(10);
    expect(list.body.meta.pagesCount).toBe(1);

    expectPostOutput(list.body.data[0], {
      title: postAttributes.title,
      shortDescription: postAttributes.shortDescription,
      content: postAttributes.content,
      blogId: createdEntity.data.attributes.blogId,
      blogName: createdEntity.data.attributes.blogName,
      createdAt: createdEntity.data.attributes.createdAt,
    });
  });

  it('GET /posts/:id should return entity by existing id', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(
      app,
      postAttributes,
      blogData,
    );
    const response = await request(app)
      .get(`${routerPath.posts}/${createdEntity.data.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expectPostOutput(response.body.data, {
      id: createdEntity.data.id,
      title: postAttributes.title,
      shortDescription: postAttributes.shortDescription,
      content: postAttributes.content,
      blogId: createdEntity.data.attributes.blogId,
      blogName: createdEntity.data.attributes.blogName,
      createdAt: createdEntity.data.attributes.createdAt,
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
      postAttributes,
      blogData,
    );

    const updatedData: PostUpdateInput = {
      data: {
        id: createdEntity.data.id,
        type: ResourceType.Posts,
        attributes: {
          title: 'Updated' + createdEntity.data.attributes.title,
          shortDescription: 'Updated' + createdEntity.data.attributes.shortDescription,
          content: 'Updated' + createdEntity.data.attributes.content,
          blogId: createdEntity.data.attributes.blogId,
        },
      },
    };

    await request(app)
      .put(`${routerPath.posts}/${createdEntity.data.id}`)
      .set('Authorization', ADMIN_AUTH)
      .send(updatedData)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const response = await request(app)
      .get(`${routerPath.posts}/${createdEntity.data.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expectPostOutput(response.body.data, {
      id: createdEntity.data.id,
      title: updatedData.data.attributes.title,
      shortDescription: updatedData.data.attributes.shortDescription,
      content: updatedData.data.attributes.content,
      blogId: updatedData.data.attributes.blogId,
      blogName: createdEntity.data.attributes.blogName,
      createdAt: createdEntity.data.attributes.createdAt,
    });
  });

  it('DELETE /posts/:id should delete the entity by id', async () => {
    const { createdEntity } = await postTestManager.createPostWithBlog(
      app,
      postAttributes,
      blogData,
    );
    await request(app)
      .delete(`${routerPath.posts}/${createdEntity.data.id}`)
      .set('Authorization', ADMIN_AUTH)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(`${routerPath.posts}/${createdEntity.data.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
    const list = await request(app).get(routerPath.posts).expect(HTTP_STATUSES.OK_200);
    expect(list.body.data).toHaveLength(0);
    expect(list.body.meta.totalCount).toBe(0);
    expect(list.body.meta.page).toBe(1);
    expect(list.body.meta.pageSize).toBe(10);
    expect(list.body.meta.pagesCount).toBe(0);
  });
});
