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

describe('Blog API body validation check', () => {
  const ADMIN_AUTH = generateBasicAuthHeader(TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD);
  const app = createTestApp();

  beforeEach(async () => {
    await clearDb(app);
  });

  const correctBlogData: BlogCreateInput = {
        name: 'Test Blog Name',
        description: 'Test description for Blog',
        websiteUrl: 'https://testblog.com',
  };

  it('POST /blogs should not create blog when incorrect body passed.', async () => {
    //  несколько полей плохие
    const invalidDataSet1 = await request(app)
      .post(routerPath.blogs)
      .set('Authorization', ADMIN_AUTH)
      .send({
        ...correctBlogData,
        name: '   ',
        description: '',
        websiteUrl: '',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    //  некорректный формат URL
    const invalidDataSet2 = await request(app)
      .post(routerPath.blogs)
      .set('Authorization', ADMIN_AUTH)
      .send({
        ...correctBlogData,
        websiteUrl: 'invalid-url',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    const list = await request(app).get(routerPath.blogs).expect(HTTP_STATUSES.OK_200);
    expect(list.body.items).toHaveLength(0);
    expect(list.body.totalCount).toBe(0);
    expect(list.body.page).toBe(1);
    expect(list.body.pageSize).toBe(10);
    expect(list.body.pagesCount).toBe(0);
  });

  it(' PUT /blogs/:id should not update blog when incorrect body passed.', async () => {
    const { createdEntity } = await blogTestManager.createBlog(app, correctBlogData);

    const invalidUpdate = await request(app)
      .put(`${routerPath.blogs}/${createdEntity.id}`)
      .set('Authorization', ADMIN_AUTH)
      .send({
            name: '   ',
            description: '',
            websiteUrl: 'invalid-url',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidUpdate.body.errorsMessages).toHaveLength(3);

    const response = await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);

    expectBlogOutput(response.body, createdEntity);
  });
});
