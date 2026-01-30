import request from 'supertest';
import { app } from '../src/set-app';
import { routerPath } from '../src/core/paths/paths';
import { HTTP_STATUSES } from '../src/core/utils/http-status';
import { blogTestManager } from '../src/core/utils/test-managers';
import { BlogInputModelDto } from '../src/features/blogs/dto/blogs.input-model.dto';

describe('Blog API body validation check', () => {
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

  const correctBlogData: BlogInputModelDto = {
    name: 'Test Blog Name',
    description: 'Test description for Blog',
    websiteUrl: 'https://testblog.com',
  };

  it('POST /blogs should not create blog when incorrect body passed.', async () => {
    //  несколько полей плохие
    const invalidDataSet1 = await request(app)
      .post(routerPath.blogs)
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
      .send({
        ...correctBlogData,
        websiteUrl: 'invalid-url',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);


    const list = await request(app).get(routerPath.blogs).expect(HTTP_STATUSES.OK_200);
    expect(list.body).toHaveLength(0);
  });

  it(' PUT /blogs/:id should not update blog when incorrect body passed.', async () => {
    const { createdEntity: createdEntity } = await blogTestManager.createBlog(
      correctBlogData
    );

    const invalidUpdate = await request(app)
      .put(`${routerPath.blogs}/${createdEntity.id}`)
      .send({
       name: '   ',
       description: '',
       websiteUrl: 'invalid-url',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidUpdate.body.errorsMessages).toHaveLength(3);

    const get = await request(app)
      .get(`${routerPath.blogs}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);

    expect(get.body).toEqual(createdEntity);
  });
});
