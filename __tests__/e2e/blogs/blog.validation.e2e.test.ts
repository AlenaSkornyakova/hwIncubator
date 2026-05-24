import request from 'supertest';
import { routerPath } from '../../../src/core/paths/paths';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { blogTestManager } from '../../utils/test-managers';
import { BlogCreateInput } from '../../../src/features/blogs/routers/input/blog-crete.input';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthHeader } from '../../utils/generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../../config/admin-credentials';
import { createTestApp } from '../../utils/createTestApp';
import { expectBlogOutput } from '../../utils/matchers';
import { ResourceType } from '../../../src/core/types/resource-type.types';

describe('Blog API body validation check', () => {
  const ADMIN_AUTH = generateBasicAuthHeader(TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD);
  const app = createTestApp();

  beforeEach(async () => {
    await clearDb(app);
  });

  const correctBlogData: BlogCreateInput = {
    data: {
      type: ResourceType.Blogs,
      attributes: {
        name: 'Test Blog Name',
        description: 'Test description for Blog',
        websiteUrl: 'https://testblog.com',
      },
    },
  };

  it('POST /blogs should not create blog when incorrect body passed.', async () => {
    //  несколько полей плохие
    const invalidDataSet1 = await request(app)
      .post(routerPath.blogs)
      .set('Authorization', ADMIN_AUTH)
      .send({
        ...correctBlogData,
        data: {
          ...correctBlogData.data,
          attributes: {
            ...correctBlogData.data.attributes,
            name: '   ',
            description: '',
            websiteUrl: '',
          },
        },
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    //  некорректный формат URL
    const invalidDataSet2 = await request(app)
      .post(routerPath.blogs)
      .set('Authorization', ADMIN_AUTH)
      .send({
        ...correctBlogData,
        data: {
          ...correctBlogData.data,
          attributes: {
            ...correctBlogData.data.attributes,
            websiteUrl: 'invalid-url',
          },
        },
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    const list = await request(app).get(routerPath.blogs).expect(HTTP_STATUSES.OK_200);
    expect(list.body.data).toHaveLength(0);
    expect(list.body.meta.totalCount).toBe(0);
    expect(list.body.meta.page).toBe(1);
    expect(list.body.meta.pageSize).toBe(10);
    expect(list.body.meta.pagesCount).toBe(0);
  });

  it(' PUT /blogs/:id should not update blog when incorrect body passed.', async () => {
    const { createdEntity } = await blogTestManager.createBlog(app, correctBlogData);

    const invalidUpdate = await request(app)
      .put(`${routerPath.blogs}/${createdEntity.data.id}`)
      .set('Authorization', ADMIN_AUTH)
      .send({
        data: {
          id: createdEntity.data.id,
          type: ResourceType.Blogs,
          attributes: {
            name: '   ',
            description: '',
            websiteUrl: 'invalid-url',
          },
        },
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidUpdate.body.errorsMessages).toHaveLength(3);

    const get = await request(app)
      .get(`${routerPath.blogs}/${createdEntity.data.id}`)
      .expect(HTTP_STATUSES.OK_200);

    expectBlogOutput(get.body.data, createdEntity.data.attributes);
  });
});
