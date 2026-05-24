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
import { ResourceType } from '../../../src/core/types/resource-type.types';

describe('Posts API body validation check', () => {
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
  it('POST /posts should not create post when incorrect body passed.', async () => {
    const { createdEntity: correctPostData } = await postTestManager.createPostWithBlog(
      app,
      postAttributes,
      blogData,
    );

    //  несколько полей плохие
    const invalidDataSet1 = await request(app)
      .post(routerPath.posts)
      .set('Authorization', ADMIN_AUTH)
      .send({
        data: {
          type: ResourceType.Posts,
          attributes: {
            title: '   ',
            shortDescription: '',
            content: '',
            blogId: correctPostData.data.attributes.blogId,
          },
        },
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    //  blogId
    const invalidDataSet2 = await request(app)
      .post(routerPath.posts)
      .set('Authorization', ADMIN_AUTH)
      .send({
        data: {
          type: ResourceType.Posts,
          attributes: {
            title: 'Test Post Title',
            shortDescription: 'Test Post Short Description',
            content: 'Test Post Content',
            blogId: 123,
          },
        },
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    const list = await request(app)
      .get(routerPath.posts)
      .set('Authorization', ADMIN_AUTH)
      .expect(HTTP_STATUSES.OK_200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.meta.totalCount).toBe(1);
    expect(list.body.meta.page).toBe(1);
    expect(list.body.meta.pageSize).toBe(10);
    expect(list.body.meta.pagesCount).toBe(1);
  });

  it(' PUT /posts/:id should not update post when incorrect body passed.', async () => {
    const { createdEntity: correctPostData } = await postTestManager.createPostWithBlog(
      app,
      postAttributes,
      blogData,
    );

    const invalidUpdate = await request(app)
      .put(`${routerPath.posts}/${correctPostData.data.id}`)
      .set('Authorization', ADMIN_AUTH)
      .send({
        data: {
          type: ResourceType.Posts,
          id: correctPostData.data.id,
          attributes: {
            title: '   ',
            shortDescription: '',
            content: '',
            blogId: 123,
          },
        },
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    expect(invalidUpdate.body.errorsMessages).toHaveLength(4);

    const get = await request(app)
      .get(`${routerPath.posts}/${correctPostData.data.id}`)
      .set('Authorization', ADMIN_AUTH)
      .expect(HTTP_STATUSES.OK_200);

    expect(get.body.data).toEqual(correctPostData.data);
  });
});
