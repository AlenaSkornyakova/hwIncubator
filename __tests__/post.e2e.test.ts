import request from 'supertest';
import { app } from '../src/set-app';
import { routerPath } from '../src/core/paths/paths';
import { HTTP_STATUSES } from '../src/core/utils/http-status';
import { PostInputModelDto } from '../src/features/posts/dto/posts.input-model.dto';
import { postTestManager } from '../src/core/utils/test-managers';
import { BlogInputModelDto } from '../src/features/blogs/dto/blogs.input-model.dto';

describe('Post API CRUD', () => {
  beforeEach(async () => {
    await request(app)
      .delete(`${routerPath.testing}/all-data`)
      .expect(HTTP_STATUSES.NO_CONTENT_204);  
  });
  afterEach(async () => {
    await request(app).delete(`${routerPath.testing}/all-data`)
    .expect(HTTP_STATUSES.NO_CONTENT_204);
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
      await request(app).get(routerPath.posts).expect(HTTP_STATUSES.OK_200, []);
    });

    it('POST /posts should create a new entity and return it', async () => {
      const { createdEntity } = await postTestManager.createPostWithBlog(postBase, blogData);
      await request(app).get(`${routerPath.posts}`).expect(HTTP_STATUSES.OK_200, [createdEntity]);
    });

    it('GET /posts/:id should return entity by existing id', async () => {
      const { createdEntity } = await postTestManager.createPostWithBlog(postBase, blogData);
      const response = await request(app)
        .get(`${routerPath.posts}/${createdEntity.id}`)
        .expect(HTTP_STATUSES.OK_200);
      expect(response.body).toEqual(createdEntity);
    });

    it('GET /posts/:id should return 404 for non-existing id', async () => {
      await request(app).get(`${routerPath.posts}/9999`).expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('PUT /posts/:id should update the entity by id with correct input data', async () => {
       const { createdEntity } = await postTestManager.createPostWithBlog(postBase, blogData);

      const updatedData: PostInputModelDto = {
        title: 'Updated' + createdEntity.title ,
        shortDescription: 'Updated' + createdEntity.shortDescription,
        content: 'Updated' + createdEntity.content,
        blogId: createdEntity.blogId,
      };
     
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

    it('DELETE /posts/:id should delete the entity by id', async () => {
      const { createdEntity } = await postTestManager.createPostWithBlog(postBase, blogData);
      await request(app)
        .delete(`${routerPath.posts}/${createdEntity.id}`)
        .expect(HTTP_STATUSES.NO_CONTENT_204);
      await request(app)
        .get(`${routerPath.posts}/${createdEntity.id}`)
        .expect(HTTP_STATUSES.NOT_FOUND_404);
    });
  });


