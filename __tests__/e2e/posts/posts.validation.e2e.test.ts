import request from 'supertest';
import { routerPath } from '../../../src/core/paths/paths';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { PostInputModelDto } from '../../../src/features/posts/dto/posts.input-model.dto';
import { postTestManager} from '../../utils/test-managers';
import { BlogInputModelDto } from '../../../src/features/blogs/dto/blogs.input-model.dto';
import { clearDb } from '../../utils/clear-db';
import { generateBasicAuthHeader } from '../../utils/generateBasicAuthHeader';
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from '../../config/admin-credentials';
import { createTestApp } from '../../utils/createTestApp';

describe('Posts API body validation check', () => {
 
const ADMIN_AUTH = generateBasicAuthHeader(
  TEST_ADMIN_USERNAME,
  TEST_ADMIN_PASSWORD,
);
const app = createTestApp();
  

  beforeEach(async () => {
    await clearDb(app);
  });


  const blogData: BlogInputModelDto = {
    name: 'Test Blog Name',
    description: 'Test description for Blog',
    websiteUrl: 'https://testblog.com',
  };

  const postData: Omit<PostInputModelDto, 'blogId'> = {
    title: 'Test Post Title',
    shortDescription: 'Test Post Short Description',
    content: 'Test Post Content',
  };
  it('POST /posts should not create post when incorrect body passed.', async () => {
    const { createdEntity: correctPostData } = await postTestManager.createPostWithBlog(
      app,
      postData,
      blogData,
    );

    //  несколько полей плохие
    const invalidDataSet1 = await request(app)
      .post(routerPath.posts)
      .set('Authorization', ADMIN_AUTH)
      .send({
        ...correctPostData,
        title: '   ',
        shortDescription: '',
        content: '',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    //  blogId 
    const invalidDataSet2 = await request(app)
      .post(routerPath.posts)
      .set('Authorization', ADMIN_AUTH)
      .send({
        ...correctPostData,
        blogId: 123,
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);
    
    const list = await request(app).get(routerPath.posts)
    .set('Authorization', ADMIN_AUTH)
    .expect(HTTP_STATUSES.OK_200);
    expect(list.body.items).toHaveLength(1);
    expect(list.body.totalCount).toBe(1);
    expect(list.body.page).toBe(1);
    expect(list.body.pageSize).toBe(10);
    expect(list.body.pagesCount).toBe(1);
  });

  it(' PUT /posts/:id should not update post when incorrect body passed.', async () => {
    
    const { createdEntity: correctPostData } = await postTestManager.createPostWithBlog(
      app,
      postData,
      blogData,
    );

    const invalidUpdate = await request(app)
      .put(`${routerPath.posts}/${correctPostData.id}`)
      .set('Authorization', ADMIN_AUTH)
      .send({
        title: '   ',
        shortDescription: '',
        content: '',
        blogId: correctPostData.blogId,
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidUpdate.body.errorsMessages).toHaveLength(3);

    const get = await request(app)
      .get(`${routerPath.posts}/${correctPostData.id}`)
      .set('Authorization', ADMIN_AUTH)
      .expect(HTTP_STATUSES.OK_200);

    expect(get.body).toEqual(correctPostData);
  });
});
