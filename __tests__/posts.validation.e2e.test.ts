import request from 'supertest';
import { app } from '../src/set-app';
import { routerPath } from '../src/core/paths/paths';
import { HTTP_STATUSES } from '../src/core/utils/http-status';
import { PostInputModelDto } from '../src/features/posts/dto/posts.input-model.dto';
import { postTestManager} from '../src/core/utils/test-managers';
import { BlogInputModelDto } from '../src/features/blogs/dto/blogs.input-model.dto';

describe('Posts API body validation check', () => {
  beforeEach(async () => {
    await request(app)
      .delete(`${routerPath.testing}/all-data`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });
  afterEach(async () => {
    await request(app)
      .delete(`${routerPath.testing}/all-data`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
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
      postData,
      blogData,
    );
    //  несколько полей плохие
    const invalidDataSet1 = await request(app)
      .post(routerPath.posts)
      .send({
        ...correctPostData,
        title: '   ',
        shortDescription: '',
        content: '',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

    //  blogId не существует
    const invalidDataSet2 = await request(app)
      .post(routerPath.posts)
      .send({
        ...correctPostData,
        blogId: 'non-existing-id',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);
    

    const list = await request(app).get(routerPath.posts).expect(HTTP_STATUSES.OK_200);
    expect(list.body).toHaveLength(1);
  });

  it(' PUT /posts/:id should not update post when incorrect body passed.', async () => {
    
    const { createdEntity: correctPostData } = await postTestManager.createPostWithBlog(
      postData,
      blogData,
    );

    const invalidUpdate = await request(app)
      .put(`${routerPath.posts}/${correctPostData.id}`)
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
      .expect(HTTP_STATUSES.OK_200);

    expect(get.body).toEqual(correctPostData);
  });
});
