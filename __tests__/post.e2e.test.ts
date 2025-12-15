import request from 'supertest';
import { app } from '../src/set-app';
import { routerPath } from '../src/core/paths/paths';
import { HTTP_STATUSES } from '../src/core/utils/http-status';
import { PostInputModelDto } from '../src/features/posts/dto/posts.input-model.dto';
import {  postTestManager } from '../src/core/utils/test-managers';


// export interface PostInputModelDto {
//   title: string;
//   shortDescription: string;
//   content: string;
//   blogId: string;
// }
// export type PostViewModelDto = {
//   id: string;
//   title: string;
//   shortDescription: string;
//   content: string;
//   blogId: string;
//   blogName: string;
// }

describe('Post API', () => {
  beforeEach(async () => {
    await request(app).delete(`${routerPath.testing}/all-data`);
  });
  afterEach(async () => {
    await request(app).delete(`${routerPath.testing}/all-data`);
  });

  const createdData: PostInputModelDto = {
    title: 'Test Post Title',
    shortDescription: 'Test Post Short Description',
    content: 'Test Post Content',
    blogId: 'Test BlogId placeholder',
  };

  it('should return 200 and an empty array. The server is alive, the route is connected, and the contract is honored.', async () => {
    await request(app).get(routerPath.blogs).expect(HTTP_STATUSES.OK_200, []);
  });

  it('should create a new entity with correct input data and return it', async () => {
    const { createdEntity } = await postTestManager.createPost(createdData);
    await request(app).get(`${routerPath.posts}`).expect(HTTP_STATUSES.OK_200, [createdEntity]);
  });

  it("shouldn't create a new entity with incorrect input data and return status 400", async () => {
    const invalidData = {
      title: 'Only title provided',
    };
    await postTestManager.createPost(invalidData as any, HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('should return entity by existing id', async () => {
    const { createdEntity } = await postTestManager.createPost(createdData);
    const response = await request(app)
      .get(`${routerPath.posts}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expect(response.body).toEqual(createdEntity);
  });

  it('should return 404 for non-existing id', async () => {
    await request(app).get(`${routerPath.posts}/9999`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('should update the entity by id with correct input data', async () => {
    const updatedData: PostInputModelDto = {
      title: createdData.title + ' - updated',
      shortDescription: createdData.shortDescription + ' - updated',
      content: createdData.content + ' - updated',
      blogId: createdData.blogId + ' - updated',
    };
    const { createdEntity } = await postTestManager.createPost(createdData);

    await request(app)
      .put(`${routerPath.posts}/${createdEntity.id}`)
      .send(updatedData)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`${routerPath.posts}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdEntity,
        ...updatedData,
      });
  });

  it("shouldn't update the entity by id with incorrect input data", async () => {
    const { createdEntity } = await postTestManager.createPost(createdData);
    const invalidData: PostInputModelDto = {
      title: '',
      shortDescription: '',
      content: '',
      blogId: '',
    };
    await request(app)
      .put(`${routerPath.posts}/${createdEntity.id}`)
      .send(invalidData)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('should delete the entity by id', async () => {
    const { createdEntity } = await postTestManager.createPost(createdData);
    await request(app)
      .delete(`${routerPath.posts}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .get(`${routerPath.posts}/${createdEntity.id}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
