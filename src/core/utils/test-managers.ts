import request from 'supertest';
import { app } from '../../set-app';

import { HTTP_STATUSES, HttpStatusType } from './http-status';
import { routerPath } from '../../core/paths/paths';
import { BlogInputModelDto } from '../../features/blogs/dto/blogs.input-model.dto';
import { PostInputModelDto } from '../../features/posts/dto/posts.input-model.dto';

export const blogTestManager = {
  async createBlog(
    data: BlogInputModelDto,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
  ) {
    const response = await request(app)
      .post(`${routerPath.blogs}`)
      .send(data)
      .expect(expectedStatusCode);

    let createdEntity;

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = response.body;

      expect(createdEntity).toEqual({
        id: expect.any(String),
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
      });
    }
    return { response, createdEntity };
  },
};

export const postTestManager = {
  async createPost(
    data: PostInputModelDto,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201,
  ) {
    const response = await request(app)
      .post(`${routerPath.posts}`)
      .send(data)
      .expect(expectedStatusCode);

    let createdEntity;

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = response.body;

      expect(createdEntity).toEqual({
        id: expect.any(String),
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: expect.any(String),
      });
    }
    return { response, createdEntity };
  },
};
